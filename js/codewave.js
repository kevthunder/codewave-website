// Generated by CoffeeScript 1.8.0
(function() {
  this.Codewave = (function() {
    function Codewave(editor, options) {
      var defaults, key, val;
      this.editor = editor;
      if (options == null) {
        options = {};
      }
      this.nameSpaces = [];
      this.vars = {};
      this.parent = options['parent'] || null;
      delete options['parent'];
      defaults = {
        'brakets': '~~',
        'deco': '~',
        'closeChar': '/',
        'noExecuteChar': '!',
        'carretChar': '|',
        'checkCarret': true
      };
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else if (this.parent != null) {
          this[key] = this.parent[key];
        } else {
          this[key] = val;
        }
      }
      if (this.editor != null) {
        this.editor.bindedTo(this);
      }
    }

    Codewave.prototype.onActivationKey = function() {
      var cmd, cpos, _ref;
      Codewave.logger.log('activation key');
      if ((cmd = (_ref = this.commandOnCursorPos()) != null ? _ref.init() : void 0)) {
        Codewave.logger.log(cmd);
        return cmd.execute();
      } else {
        cpos = this.editor.getCursorPos();
        if (cpos.start === cpos.end) {
          return this.addBrakets(cpos.start, cpos.end);
        } else {
          return this.promptClosingCmd(cpos.start, cpos.end);
        }
      }
    };

    Codewave.prototype.commandOnCursorPos = function() {
      var cpos;
      cpos = this.editor.getCursorPos();
      return this.commandOnPos(cpos.end);
    };

    Codewave.prototype.commandOnPos = function(pos) {
      var next, prev;
      if (this.precededByBrakets(pos) && this.followedByBrakets(pos) && this.countPrevBraket(pos) % 2 === 1) {
        prev = pos - this.brakets.length;
        next = pos;
      } else {
        if (this.precededByBrakets(pos) && this.countPrevBraket(pos) % 2 === 0) {
          pos -= this.brakets.length;
        }
        prev = this.findPrevBraket(pos);
        if (prev == null) {
          return null;
        }
        next = this.findNextBraket(pos - 1);
        if (next === null || this.countPrevBraket(prev) % 2 !== 0) {
          return null;
        }
      }
      return new Codewave.CmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
    };

    Codewave.prototype.nextCmd = function(start) {
      var beginning, f, pos;
      if (start == null) {
        start = 0;
      }
      pos = start;
      while (f = this.findAnyNext(pos, [this.brakets, "\n"])) {
        pos = f.pos + f.str.length;
        if (f.str === this.brakets) {
          if (typeof beginning !== "undefined" && beginning !== null) {
            return new Codewave.CmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
          } else {
            beginning = f.pos;
          }
        } else {
          beginning = null;
        }
      }
      return null;
    };

    Codewave.prototype.getEnclosingCmd = function(pos) {
      var closingPrefix, cmd, cpos, p;
      if (pos == null) {
        pos = 0;
      }
      cpos = pos;
      closingPrefix = this.brakets + this.closeChar;
      while ((p = this.findNext(cpos, closingPrefix)) != null) {
        if (cmd = this.commandOnPos(p + closingPrefix.length)) {
          cpos = cmd.getEndPos();
          if (cmd.pos < pos) {
            return cmd;
          }
        } else {
          cpos = p + closingPrefix.length;
        }
      }
      return null;
    };

    Codewave.prototype.precededByBrakets = function(pos) {
      return this.editor.textSubstr(pos - this.brakets.length, pos) === this.brakets;
    };

    Codewave.prototype.followedByBrakets = function(pos) {
      return this.editor.textSubstr(pos, pos + this.brakets.length) === this.brakets;
    };

    Codewave.prototype.countPrevBraket = function(start) {
      var i;
      i = 0;
      while (start = this.findPrevBraket(start)) {
        i++;
      }
      return i;
    };

    Codewave.prototype.isEndLine = function(pos) {
      return this.editor.textSubstr(pos, pos + 1) === "\n" || pos + 1 >= this.editor.textLen();
    };

    Codewave.prototype.findLineStart = function(pos) {
      var p;
      p = this.findAnyNext(pos, ["\n"], -1);
      if (p) {
        return p.pos + 1;
      } else {
        return 0;
      }
    };

    Codewave.prototype.findPrevBraket = function(start) {
      return this.findNextBraket(start, -1);
    };

    Codewave.prototype.findNextBraket = function(start, direction) {
      var f;
      if (direction == null) {
        direction = 1;
      }
      f = this.findAnyNext(start, [this.brakets, "\n"], direction);
      if (f && f.str === this.brakets) {
        return f.pos;
      }
    };

    Codewave.prototype.findPrev = function(start, string) {
      return this.findNext(start, string, -1);
    };

    Codewave.prototype.findNext = function(start, string, direction) {
      var f;
      if (direction == null) {
        direction = 1;
      }
      f = this.findAnyNext(start, [string], direction);
      if (f) {
        return f.pos;
      }
    };

    Codewave.prototype.findAnyNext = function(start, strings, direction) {
      var end, pos, stri, _i, _len, _ref, _ref1;
      if (direction == null) {
        direction = 1;
      }
      pos = start;
      while (true) {
        if (!((0 <= pos && pos < this.editor.textLen()))) {
          return null;
        }
        for (_i = 0, _len = strings.length; _i < _len; _i++) {
          stri = strings[_i];
          _ref = [pos, pos + stri.length * direction], start = _ref[0], end = _ref[1];
          if (end < start) {
            _ref1 = [end, start], start = _ref1[0], end = _ref1[1];
          }
          if (stri === this.editor.textSubstr(start, end)) {
            return new Codewave.util.StrPos(direction < 0 ? pos - stri.length : pos, stri);
          }
        }
        pos += direction;
      }
    };

    Codewave.prototype.findMatchingPair = function(startPos, opening, closing, direction) {
      var f, nested, pos;
      if (direction == null) {
        direction = 1;
      }
      pos = startPos;
      nested = 0;
      while (f = this.findAnyNext(pos, [closing, opening], direction)) {
        pos = f.pos + (direction > 0 ? f.str.length : 0);
        if (f.str === (direction > 0 ? closing : opening)) {
          if (nested > 0) {
            nested--;
          } else {
            return f;
          }
        } else {
          nested++;
        }
      }
      return null;
    };

    Codewave.prototype.addBrakets = function(start, end) {
      if (start === end) {
        this.editor.insertTextAt(this.brakets + this.brakets, start);
      } else {
        this.editor.insertTextAt(this.brakets, end);
        this.editor.insertTextAt(this.brakets, start);
      }
      return this.editor.setCursorPos(end + this.brakets.length);
    };

    Codewave.prototype.promptClosingCmd = function(start, end) {
      if (this.closingPromp != null) {
        this.closingPromp.stop();
      }
      return this.closingPromp = (new Codewave.ClosingPromp(this, start, end)).begin();
    };

    Codewave.prototype.parseAll = function(recursive) {
      var cmd, parser, pos;
      if (recursive == null) {
        recursive = true;
      }
      pos = 0;
      while (cmd = this.nextCmd(pos)) {
        pos = cmd.getEndPos();
        this.editor.setCursorPos(pos);
        if (recursive && (cmd.content != null)) {
          parser = new Codewave(new Codewave.TextParser(cmd.content), {
            parent: this
          });
          cmd.content = parser.parseAll();
        }
        if (cmd.init().execute() != null) {
          if ((cmd.replaceEnd != null)) {
            pos = cmd.replaceEnd;
          } else {
            pos = this.editor.getCursorPos().end;
          }
        }
      }
      return this.getText();
    };

    Codewave.prototype.getText = function() {
      return this.editor.text();
    };

    Codewave.prototype.getNameSpaces = function() {
      var npcs;
      npcs = ['core'].concat(this.nameSpaces);
      if (this.parent != null) {
        npcs = npcs.concat(this.parent.getNameSpaces());
      }
      if (this.context != null) {
        if (this.context.finder != null) {
          npcs = npcs.concat(this.context.finder.namespaces);
        }
        npcs = npcs.concat([this.context.cmd.fullName]);
      }
      return Codewave.util.unique(npcs);
    };

    Codewave.prototype.addNameSpace = function(name) {
      return this.nameSpaces.push(name);
    };

    Codewave.prototype.removeNameSpace = function(name) {
      return this.nameSpaces = this.nameSpaces.filter(function(n) {
        return n !== name;
      });
    };

    Codewave.prototype.getCmd = function(cmdName, nameSpaces) {
      var finder;
      if (nameSpaces == null) {
        nameSpaces = [];
      }
      finder = this.getFinder(cmdName, nameSpaces);
      return finder.find();
    };

    Codewave.prototype.getFinder = function(cmdName, nameSpaces) {
      if (nameSpaces == null) {
        nameSpaces = [];
      }
      return new Codewave.CmdFinder(cmdName, {
        namespaces: Codewave.util.union(this.getNameSpaces(), nameSpaces),
        useDetectors: this.isRoot(),
        codewave: this
      });
    };

    Codewave.prototype.isRoot = function() {
      return (this.parent == null) && ((this.context == null) || (this.context.finder == null));
    };

    Codewave.prototype.getRoot = function() {
      if (this.isRoot) {
        return this;
      } else if (this.parent != null) {
        return this.parent.getRoot();
      } else if (this.context != null) {
        return this.context.codewave.getRoot();
      }
    };

    Codewave.prototype.getCommentChar = function() {
      return '<!-- %s -->';
    };

    Codewave.prototype.wrapComment = function(str) {
      var cc;
      cc = this.getCommentChar();
      if (cc.indexOf('%s') > -1) {
        return cc.replace('%s', str);
      } else {
        return cc + ' ' + str + ' ' + cc;
      }
    };

    Codewave.prototype.wrapCommentLeft = function(str) {
      var cc, i;
      if (str == null) {
        str = '';
      }
      cc = this.getCommentChar();
      console.log();
      if ((i = cc.indexOf('%s')) > -1) {
        return cc.substr(0, i) + str;
      } else {
        return cc + ' ' + str;
      }
    };

    Codewave.prototype.wrapCommentRight = function(str) {
      var cc, i;
      if (str == null) {
        str = '';
      }
      cc = this.getCommentChar();
      if ((i = cc.indexOf('%s')) > -1) {
        return str + cc.substr(i + 2);
      } else {
        return str + ' ' + cc;
      }
    };

    Codewave.prototype.removeCarret = function(txt) {
      var reCarret, reQuoted, reTmp, tmp;
      tmp = '[[[[quoted_carret]]]]';
      reCarret = new RegExp(Codewave.util.escapeRegExp(this.carretChar), "g");
      reQuoted = new RegExp(Codewave.util.escapeRegExp(this.carretChar + this.carretChar), "g");
      reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g");
      return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, this.carretChar);
    };

    Codewave.prototype.getCarretPos = function(txt) {
      var i;
      txt = txt.replace(this.carretChar + this.carretChar, ' ');
      if ((i = txt.indexOf(this.carretChar)) > -1) {
        return i;
      }
    };

    return Codewave;

  })();

  this.Codewave.init = function() {
    Codewave.Command.initCmds();
    return Codewave.Command.loadCmds();
  };

}).call(this);

//# sourceMappingURL=codewave.js.map
