// Generated by CoffeeScript 1.8.0
(function() {
  this.Codewave = (function() {
    function Codewave(editor) {
      this.editor = editor;
      this.editor.onActivationKey = (function(_this) {
        return function() {
          return _this.onActivationKey();
        };
      })(this);
    }

    Codewave.prototype.onActivationKey = function() {
      var cmd;
      console.log('activation key');
      if ((cmd = this.cursorOnCommand())) {
        console.log(cmd);
        return cmd.execute();
      } else {
        return this.addBrakets();
      }
    };

    Codewave.prototype.cursorOnCommand = function() {
      var cpos, next, pos, prev;
      cpos = this.editor.getCursorPos();
      pos = cpos.end;
      prev = this.findPrevBraket(this.isEndLine(pos) ? pos : pos + 1);
      if (prev == null) {
        return false;
      }
      if (prev >= pos - 2) {
        pos = prev;
        prev = this.findPrevBraket(pos);
      }
      next = this.findNextBraket(pos);
      if (!((next != null) && this.countPrevBraket(prev) % 2 === 0)) {
        return false;
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
      console.log(f);
      if (f) {
        return f.pos;
      }
    };

    Codewave.prototype.findAnyNext = function(start, strings, direction) {
      var end, pos, str, _i, _len, _ref, _ref1;
      if (direction == null) {
        direction = 1;
      }
      pos = start;
      while (true) {
        if (!((0 <= pos && pos < this.editor.textLen()))) {
          return false;
        }
        for (_i = 0, _len = strings.length; _i < _len; _i++) {
          str = strings[_i];
          _ref = [pos, pos + str.length * direction], start = _ref[0], end = _ref[1];
          if (end < start) {
            _ref1 = [end, start], start = _ref1[0], end = _ref1[1];
          }
          if (str === this.editor.textSubstr(start, end)) {
            return {
              str: str,
              pos: direction < 0 ? pos - str.length : pos
            };
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

    Codewave.prototype.addBrakets = function() {
      var cpos;
      cpos = this.editor.getCursorPos();
      this.editor.insertTextAt(this.brakets, cpos.end);
      this.editor.insertTextAt(this.brakets, cpos.start);
      return this.editor.setCursorPos(cpos.end + this.brakets.length);
    };

    Codewave.prototype.parseAll = function() {
      var cmd, pos;
      pos = 0;
      while (cmd = this.nextCmd(pos)) {
        pos = cmd.getEndPos();
        this.editor.setCursorPos(pos);
        if (cmd.execute() != null) {
          pos = this.editor.getCursorPos().end;
        }
      }
      return this.getText();
    };

    Codewave.prototype.getText = function() {
      return this.editor.text();
    };

    Codewave.prototype.getCmd = function(cmdName) {
      var cmd;
      cmd = Codewave.cmd[cmdName];
      if (typeof cmd === "function") {
        if ((cmd.prototype.execute != null) || (cmd.prototype.result != null)) {
          return cmd;
        } else {
          return {
            result: cmd
          };
        }
      } else if (typeof cmd === 'string') {
        return {
          result: cmd
        };
      } else {
        return cmd;
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

    Codewave.prototype.brakets = '~~';

    Codewave.prototype.deco = '~';

    Codewave.prototype.closeChar = '/';

    return Codewave;

  })();

  this.Codewave.util = {
    escapeRegExp: function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  };

}).call(this);

//# sourceMappingURL=codewave.js.map