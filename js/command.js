// Generated by CoffeeScript 1.9.0
(function() {
  var _optKey;

  _optKey = function(key, dict, defVal) {
    if (defVal == null) {
      defVal = null;
    }
    if (key in dict) {
      return dict[key];
    } else {
      return defVal;
    }
  };

  this.Codewave.Command = (function() {
    function Command(_at_name, _at_data, _at_parent) {
      var _ref;
      this.name = _at_name;
      this.data = _at_data != null ? _at_data : null;
      this.parent = _at_parent != null ? _at_parent : null;
      this.cmds = [];
      this.detectors = [];
      this.executeFunct = this.resultFunct = this.resultStr = this.aliasOf = this.cls = null;
      this.aliased = null;
      this.fullName = this.name;
      this.depth = 0;
      _ref = [null, false], this._parent = _ref[0], this._inited = _ref[1];
      this.setParent(parent);
      this.defaults = {};
      this.defaultOptions = {
        nameToParam: null,
        checkCarret: true,
        parse: false,
        beforeExecute: null,
        alterResult: null,
        preventParseAll: false
      };
      this.options = {};
      this.finalOptions = null;
    }

    Command.prototype.setParent = function(value) {
      if (this._parent !== value) {
        this._parent = value;
        this.fullName = ((this._parent != null) && (this._parent.name != null) ? this._parent.fullName + ':' + this.name : this.name);
        return this.depth = (this._parent != null ? this._parent.depth + 1 : 0);
      }
    };

    Command.prototype.init = function() {
      if (!this._inited) {
        this._inited = true;
        this.parseData(this.data);
      }
      return this;
    };

    Command.prototype.isEditable = function() {
      return this.resultStr != null;
    };

    Command.prototype.isExecutable = function() {
      var p, _i, _len, _ref;
      _ref = ['resultStr', 'resultFunct', 'aliasOf', 'cls', 'executeFunct'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (this[p] != null) {
          return true;
        }
      }
      return false;
    };

    Command.prototype.resultIsAvailable = function(instance) {
      var aliased, p, _i, _len, _ref;
      if (instance == null) {
        instance = null;
      }
      if ((instance != null) && (instance.cmdObj != null)) {
        return instance.cmdObj.resultIsAvailable();
      }
      aliased = this.getAliased(instance);
      if (aliased != null) {
        return aliased.resultIsAvailable(instance);
      }
      _ref = ['resultStr', 'resultFunct'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (this[p] != null) {
          return true;
        }
      }
      return false;
    };

    Command.prototype.getDefaults = function(instance) {
      var aliased, res;
      if (instance == null) {
        instance = null;
      }
      res = {};
      aliased = this.getAliased(instance);
      if (aliased != null) {
        res = Codewave.util.merge(res, aliased.getDefaults(instance));
      }
      res = Codewave.util.merge(res, this.defaults);
      if ((instance != null) && (instance.cmdObj != null)) {
        res = Codewave.util.merge(res, instance.cmdObj.getDefaults());
      }
      return res;
    };

    Command.prototype.result = function(instance) {
      var aliased;
      if ((instance != null) && (instance.cmdObj != null)) {
        return instance.cmdObj.result();
      }
      aliased = this.getAliased(instance);
      if (aliased != null) {
        return aliased.result(instance);
      }
      if (this.resultFunct != null) {
        return this.resultFunct(instance);
      }
      if (this.resultStr != null) {
        return this.resultStr;
      }
    };

    Command.prototype.execute = function(instance) {
      var aliased;
      if ((instance != null) && (instance.cmdObj != null)) {
        return instance.cmdObj.execute();
      }
      aliased = this.getAliased(instance);
      if (aliased != null) {
        return aliased.execute(instance);
      }
      if (this.executeFunct != null) {
        return this.executeFunct(instance);
      }
    };

    Command.prototype.getExecutableObj = function(instance) {
      var aliased;
      this.init();
      if (this.cls != null) {
        return new this.cls(instance);
      }
      aliased = this.getAliased(instance);
      if (aliased != null) {
        return aliased.getExecutableObj(instance);
      }
    };

    Command.prototype.getAliased = function(instance) {
      var aliasOf, aliased, context;
      if (instance == null) {
        instance = null;
      }
      if ((instance != null) && instance.cmd === this && (instance.aliasedCmd != null)) {
        return instance.aliasedCmd || null;
      }
      if (this.aliasOf != null) {
        if (instance != null) {
          context = instance.context;
        } else {
          context = new Codewave.Context();
        }
        aliasOf = this.aliasOf;
        if (instance != null) {
          aliasOf = aliasOf.replace('%name%', instance.cmdName);
          this.finder = instance._getFinder(aliasOf);
          this.finder.useFallbacks = false;
          aliased = this.finder.find();
        } else {
          aliased = context.getCmd(aliasOf);
        }
        if (instance != null) {
          instance.aliasedCmd = aliased || false;
        }
        return aliased;
      }
    };

    Command.prototype.setOptions = function(data) {
      var key, val, _results;
      _results = [];
      for (key in data) {
        val = data[key];
        if (key in this.defaultOptions) {
          _results.push(this.options[key] = val);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Command.prototype.getOptions = function(instance) {
      var aliased, opt;
      if (instance == null) {
        instance = null;
      }
      if ((instance != null) && (instance.cmdOptions != null)) {
        return instance.cmdOptions;
      }
      opt = {};
      opt = Codewave.util.merge(opt, this.defaultOptions);
      aliased = this.getAliased(instance);
      if (aliased != null) {
        opt = Codewave.util.merge(opt, aliased.getOptions(instance));
      }
      opt = Codewave.util.merge(opt, this.options);
      if ((instance != null) && (instance.cmdObj != null)) {
        opt = Codewave.util.merge(opt, instance.cmdObj.getOptions());
      }
      if (instance != null) {
        instance.cmdOptions = opt;
      }
      return opt;
    };

    Command.prototype.getOption = function(key, instance) {
      var options;
      if (instance == null) {
        instance = null;
      }
      options = this.getOptions(instance);
      if (key in options) {
        return options[key];
      }
    };

    Command.prototype.parseData = function(data) {
      this.data = data;
      if (typeof data === 'string') {
        this.resultStr = data;
        this.options['parse'] = true;
        return true;
      } else if (data != null) {
        return this.parseDictData(data);
      }
      return false;
    };

    Command.prototype.parseDictData = function(data) {
      var execute, res;
      res = _optKey('result', data);
      if (typeof res === "function") {
        this.resultFunct = res;
      } else if (res != null) {
        this.resultStr = res;
        this.options['parse'] = true;
      }
      execute = _optKey('execute', data);
      if (typeof execute === "function") {
        this.executeFunct = execute;
      }
      this.aliasOf = _optKey('aliasOf', data);
      this.cls = _optKey('cls', data);
      this.defaults = _optKey('defaults', data, this.defaults);
      this.setOptions(data);
      if ('help' in data) {
        this.addCmd(this, new Command('help', data['help'], this));
      }
      if ('fallback' in data) {
        this.addCmd(this, new Command('fallback', data['fallback'], this));
      }
      if ('cmds' in data) {
        this.addCmds(data['cmds']);
      }
      return true;
    };

    Command.prototype.addCmds = function(cmds) {
      var data, name, _results;
      _results = [];
      for (name in cmds) {
        data = cmds[name];
        _results.push(this.addCmd(new Command(name, data, this)));
      }
      return _results;
    };

    Command.prototype.addCmd = function(cmd) {
      var exists;
      exists = this.getCmd(cmd.name);
      if (exists != null) {
        this.removeCmd(exists);
      }
      cmd.setParent(this);
      this.cmds.push(cmd);
      return cmd;
    };

    Command.prototype.removeCmd = function(cmd) {
      var i;
      if ((i = this.cmds.indexOf(cmd)) > -1) {
        this.cmds.splice(i, 1);
      }
      return cmd;
    };

    Command.prototype.getCmd = function(fullname) {
      var cmd, name, space, _i, _len, _ref, _ref1;
      this.init();
      _ref = Codewave.util.splitFirstNamespace(fullname), space = _ref[0], name = _ref[1];
      if (space != null) {
        return this.getCmd(space).getCmd(name);
      }
      _ref1 = this.cmds;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cmd = _ref1[_i];
        if (cmd.name === name) {
          return cmd;
        }
      }
    };

    Command.prototype.setCmd = function(fullname, cmd) {
      var name, next, space, _ref;
      _ref = Codewave.util.splitFirstNamespace(fullname), space = _ref[0], name = _ref[1];
      if (space != null) {
        next = this.getCmd(space);
        if (next == null) {
          next = this.addCmd(new Command(space));
        }
        return next.setCmd(name, cmd);
      } else {
        this.addCmd(cmd);
        return cmd;
      }
    };

    Command.prototype.addDetector = function(detector) {
      return this.detectors.push(detector);
    };

    return Command;

  })();

  this.Codewave.Command.cmdInitialisers = [];

  this.Codewave.Command.initCmds = function() {
    var initialiser, _i, _len, _ref, _results;
    Codewave.Command.cmds = new Codewave.Command(null, {
      'cmds': {
        'hello': 'Hello, World!'
      }
    });
    _ref = Codewave.Command.cmdInitialisers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      initialiser = _ref[_i];
      _results.push(initialiser());
    }
    return _results;
  };

  this.Codewave.Command.saveCmd = function(fullname, data) {
    var savedCmds;
    Codewave.Command.cmds.setCmd(fullname, new Codewave.Command(fullname.split(':').pop(), data));
    savedCmds = Codewave.storage.load('cmds');
    if (savedCmds == null) {
      savedCmds = {};
    }
    savedCmds[fullname] = data;
    return Codewave.storage.save('cmds', savedCmds);
  };

  this.Codewave.Command.loadCmds = function() {
    var data, fullname, savedCmds, _results;
    savedCmds = Codewave.storage.load('cmds');
    if (savedCmds != null) {
      _results = [];
      for (fullname in savedCmds) {
        data = savedCmds[fullname];
        _results.push(Codewave.Command.cmds.setCmd(fullname, new Codewave.Command(fullname.split(':').pop(), data)));
      }
      return _results;
    }
  };

  this.Codewave.BaseCommand = (function() {
    function BaseCommand(_at_instance) {
      this.instance = _at_instance;
    }

    BaseCommand.prototype.init = function() {};

    BaseCommand.prototype.resultIsAvailable = function() {
      return this["result"] != null;
    };

    BaseCommand.prototype.getDefaults = function() {
      return {};
    };

    BaseCommand.prototype.getOptions = function() {
      return {};
    };

    return BaseCommand;

  })();

}).call(this);

//# sourceMappingURL=command.js.map
