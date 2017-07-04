<autocomplete>

    <div show={this.suggestions} id="suggestions">
        <input name="acinput" placeholder="enter your search" id="acinput" onkeyup="{ search }" />
        <i class="icon">&#9906;</i>
        <!-- <i>&#8981;</i> -->
        <ul>
            <li if={spellcheck.length > 0}><b>Did you mean: <i>{ spellcheck[0].word }</i> ?</b></li>
            <li each={suggest, i in suggestions} onclick="{ parent.selected }" class="{ active: parent.active==i}">
                <span>{ suggest.term }</span>
            </li>
        </ul>
    </div>

    <script>
        this.suggestions = []
        this.spellcheck = []
        this.active = -1

        this.on('mount', function(){

            this.rest = window.client.service('solr');

              // this.rest.find()
              //   .then(res => {
              //       console.log('find res ???',res)
              //   })
              //   .catch(err => {
              //       console.log('find err ???',err)
              //   })

              //   this.search.focus();
              //   document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {
              //       this.parentNode.querySelector('input').focus();
              //   });
              //   console.log('monted')
        })

        this.on('mount', function(){
            setTimeout(function(){document.getElementById("acinput").focus()},1000);
        })

        this.search = (e) =>  {
            var self = this;

            if(e.target.value.length < this.min) {
                // this.filtered = []
                this.active = -1
                return
            }

            if(e.which == 40 && self.suggestions.length) { // down
                this.active = Math.min(this.active+1, self.suggestions.length-1)
                console.log('findthis.active',this.active);
                return
            }

            if(e.which == 38 && self.suggestions.length) { // up
                console.log('findthis.active',this.active);
                this.active = Math.max(this.active-1, 0)
                return
            }

            if(e.which == 13) { // enter
                // self.suggestions.length && this.selection(self.suggestions[this.active])
                alert('escaoe');
            }

            if(e.which == 27) { // escape
                alert('escaoe')
            }
            this.active=-1
            this.rest
                .find({query:{ $suggest: e.target.value}})
                .then(res => {
                    if(typeof res.suggest.suggest[e.target.value].suggestions != 'undefined') {
                        self.suggestions = res.suggest.suggest[e.target.value].suggestions;
                    } else {
                        self.suggestions = [];
                    }

                    if(typeof res.spellcheck != 'undefined' && res.spellcheck.suggestions[1]) {
                        self.spellcheck = res.spellcheck.suggestions[1].suggestion;
                    } else {
                        self.spellcheck = [];
                    }
                    self.update();
                })
                .catch(err => {
                    console.log('suggest err',err)
                })




        }

    </script>

    <style>
        #suggestions {
            background-color: #000000;
            -webkit-box-shadow: 10px 10px 50px -3px rgba(0,0,0,0.75);
            -moz-box-shadow: 10px 10px 50px -3px rgba(0,0,0,0.75);
            box-shadow: 10px 10px 50px -3px rgba(0,0,0,0.75);
            padding: 4px;
        }

        #suggestions i.icon {
            -webkit-transform: rotate(35deg);
               -moz-transform: rotate(35deg);
                 -o-transform: rotate(35deg);
                    transform: rotate(35deg);
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 32px;
        }
        #suggestions ul {
            list-style: none;
            text-align: left;
            color:#1f8dd6;
            padding: 0;
            margin: 0;
            font-size: 14px;
            text-transform: none;
        }
        #suggestions ul li span{
            margin: 0 3px;
        }
        #suggestions ul li.active{
            background-color: rgb(39, 38, 38);

        }

        #acinput {
          display: inline-block;
          -webkit-transition: box-shadow .4s ease, background .4s ease;
          transition: box-shadow .4s ease, background .4s ease;
          border: 0;
          border-radius: 0px;
          box-shadow: inset 0 0 0 2px #000000;
          background: #000000;
          width: 100%;
          padding: 2px;
          margin: : 2px;
          line-height: 2em;
          vertical-align: middle;
          white-space: normal;
          font-size: inherit;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          color:#1f8dd6;
          font-size: 18px;

        }
        #acinput:after {
            content: "&#9906;"
        }
        #acinput::-webkit-search-decoration, #acinput::-webkit-search-cancel-button, #acinput::-webkit-search-results-button, #acinput::-webkit-search-results-decoration {
          display: none;
        }

        #acinput:hover {
          box-shadow: inset 0 0 0 2px black;
        }

        #acinput:focus, #acinput:active {
          outline: 0;
          border-bottom: 1px #1f8dd6 solid;
          /*box-shadow: inset 0 0 0 1px #1f8dd6;*/
          /* background: #808080; */
        }

        #acinput::-webkit-input-placeholder {
          color: #313131;
        }

        #acinput::-moz-placeholder {
          color: #313131;
        }

        #acinput:-ms-input-placeholder {
          color: #313131;
        }

        #acinput::placeholder {
          color: #313131;
        }


    </style>

</autocomplete>