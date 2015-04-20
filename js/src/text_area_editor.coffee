class @Codewave.DomKeyListener
  startListening: (target) ->
    target.onkeydown = (e) => 
      if e.keyCode == 69 && e.ctrlKey && e.shiftKey
        e.preventDefault()
        if @onActivationKey?
          @onActivationKey()
    target.onkeyup = (e) => 
      if @onAnyChange?
        @onAnyChange(e)
    target.onkeypress = (e) => 
      if @onAnyChange?
        @onAnyChange(e)

class @Codewave.TextAreaEditor extends Codewave.TextParser
  constructor: (@target) ->
    # Codewave.logger.toMonitor(this,'textEventChange')
    @obj = document.getElementById(@target)
  bindedTo: (codewave) ->
    @onActivationKey = => if document.activeElement == @obj then codewave.onActivationKey()
    @startListening(document)
  startListening: Codewave.DomKeyListener.prototype.startListening
  selectionPropExists: ->
    "selectionStart" of @obj
  hasFocus: -> 
    document.activeElement is @obj
  text: (val) ->
    if val?
      unless @textEventChange(val)
        @obj.value = val
    @obj.value
  spliceText: (start, end, text) ->
    @textEventChange(text, start, end) or super(start, end, text)
  textEventChange: (text, start = 0, end = null) ->
    event = document.createEvent('TextEvent') if document.createEvent?
    if event? and event.initTextEvent?
      end = @textLen() unless end?
      event.initTextEvent('textInput', true, true, null, text || "\0", 9)
      @setCursorPos(start,end)
      @obj.dispatchEvent(event)
      true
    else 
      false
  getCursorPos: ->
    return @tmpCursorPos if @tmpCursorPos?
    if @hasFocus
      if @selectionPropExists
        new Codewave.util.Pos(@obj.selectionStart,@obj.selectionEnd)
      else
        @getCursorPosFallback()
  getCursorPosFallback: ->
    if @obj.createTextRange
      sel = document.selection.createRange()
      if sel.parentElement() is @obj
        rng = @obj.createTextRange()
        rng.moveToBookmark sel.getBookmark()
        len = 0

        while rng.compareEndPoints("EndToStart", rng) > 0
          len++
          rng.moveEnd("character", -1)
        rng.setEndPoint "StartToStart", @obj.createTextRange()
        pos = new Codewave.util.Pos(0,len)
        while rng.compareEndPoints("EndToStart", rng) > 0
          pos.start++
          pos.end++
          rng.moveEnd("character", -1)
        return pos
  setCursorPos: (start, end) ->
    end = start if arguments.length < 2
    if @selectionPropExists
      @tmpCursorPos = ( start: start, end: end )
      @obj.selectionStart = start
      @obj.selectionEnd = end
      setTimeout (=>
        @tmpCursorPos = null
        @obj.selectionStart = start
        @obj.selectionEnd = end
      ), 1
    else 
      @setCursorPosFallback(start, end)
    return
  setCursorPosFallback: (start, end) ->
    if @obj.createTextRange
      rng = @obj.createTextRange()
      rng.moveStart "character", start
      rng.collapse()
      rng.moveEnd "character", end - start
      rng.select()
  getLang: ->
    @obj.getAttribute('data-lang') if @obj.hasAttribute('data-lang')
      