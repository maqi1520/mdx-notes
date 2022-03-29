// https://github.com/dmihal/Subworkers

/*
The MIT License (MIT)

Copyright (c) 2015 David Mihal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

;(function () {
  /* Detect if we're in a worker or not */
  var isWorker = false
  try {
    document
  } catch (e) {
    isWorker = true
  }

  if (isWorker) {
    if (!self.Worker) {
      self.Worker = function (path) {
        var that = this
        this.id = Math.random().toString(36).substr(2, 5)

        this.eventListeners = {
          message: [],
        }
        self.addEventListener('message', function (e) {
          if (e.data._from === that.id) {
            var newEvent = new MessageEvent('message')
            newEvent.initMessageEvent(
              'message',
              false,
              false,
              e.data.message,
              that,
              '',
              null,
              []
            )
            that.dispatchEvent(newEvent)
            if (that.onmessage) {
              that.onmessage(newEvent)
            }
          }
        })

        var absPath = path.charAt(0) == '/' ? path : '/' + path
        self.postMessage({
          _subworker: true,
          cmd: 'newWorker',
          id: this.id,
          path: absPath,
        })
      }
      Worker.prototype = {
        onerror: null,
        onmessage: null,
        postMessage: function (message, transfer) {
          self.postMessage(
            {
              _subworker: true,
              id: this.id,
              cmd: 'passMessage',
              message: message,
              transfer: transfer,
            },
            transfer
          )
        },
        terminate: function () {
          self.postMessage({
            _subworker: true,
            cmd: 'terminate',
            id: this.id,
          })
        },
        addEventListener: function (type, listener, useCapture) {
          if (this.eventListeners[type]) {
            this.eventListeners[type].push(listener)
          }
        },
        removeEventListener: function (type, listener, useCapture) {
          if (!(type in this.eventListeners)) {
            return
          }
          var index = this.eventListeners[type].indexOf(listener)
          if (index !== -1) {
            this.eventListeners[type].splice(index, 1)
          }
        },
        dispatchEvent: function (event) {
          var listeners = this.eventListeners[event.type]
          for (var i = 0; i < listeners.length; i++) {
            listeners[i](event)
          }
        },
      }
    }
  }

  var allWorkers = {}
  var cmds = {
    newWorker: function (event) {
      var worker = new Worker(event.data.path)
      worker.addEventListener('message', function (e) {
        var envelope = {
          _from: event.data.id,
          message: e.data,
        }
        event.target.postMessage(envelope)
      })
      allWorkers[event.data.id] = worker
    },
    terminate: function (event) {
      allWorkers[event.data.id].terminate()
    },
    passMessage: function (event) {
      allWorkers[event.data.id].postMessage(
        event.data.message,
        event.data.transfer
      )
    },
  }
  var messageRecieved = function (event) {
    if (event.data._subworker) {
      cmds[event.data.cmd](event)
    }
  }

  /* Hijack Worker */
  var oldWorker = Worker
  Worker = function (path) {
    path = path.toString()
    if (this.constructor !== Worker) {
      throw new TypeError(
        "Failed to construct 'Worker': Please use the 'new' operator, this DOM object constructor cannot be called as a function."
      )
    }

    var blobIndex = path.indexOf('blob:')

    if (blobIndex !== -1 && blobIndex !== 0) {
      path = path.substring(blobIndex)
    }

    var newWorker = new oldWorker(path)
    newWorker.addEventListener('message', messageRecieved)

    return newWorker
  }
})()
