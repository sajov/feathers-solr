<autocomplete>

    <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
        <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-search-1" viewBox="0 0 40 40">
            <path d="M27.6 29.15c-1.99 1.643-4.543 2.63-7.326 2.63-6.355 0-11.507-5.15-11.507-11.506 0-6.355 5.152-11.507 11.507-11.507 6.355 0 11.507 5.152 11.507 11.507 0 2.783-.987 5.335-2.63 7.325l7.392 7.392c.43.43.436 1.124.005 1.555-.428.428-1.122.428-1.555-.005L27.6 29.15zm-7.326.44c5.145 0 9.315-4.17 9.315-9.316 0-5.145-4.17-9.315-9.316-9.315-5.145 0-9.315 4.17-9.315 9.314 0 5.145 4.17 9.315 9.314 9.315zm16.813.81C38.982 27.292 40 23.72 40 20 40 8.954 31.046 0 20 0S0 8.954 0 20s8.954 20 20 20c3.76 0 7.37-1.04 10.5-2.974.514-.32.674-.994.355-1.51-.318-.514-.993-.673-1.508-.355C26.56 36.884 23.35 37.81 20 37.81c-9.835 0-17.808-7.973-17.808-17.808S10.165 2.192 20 2.192 37.808 10.165 37.808 20c0 3.314-.905 6.492-2.593 9.26-.315.515-.15 1.19.365 1.505.517.315 1.19.152 1.507-.365z" fill-rule="evenodd" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-clear-5" viewBox="0 0 20 20">
            <path d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10zm1.35-10.123l3.567 3.568-1.225 1.226-3.57-3.568-3.567 3.57-1.226-1.227 3.568-3.568-3.57-3.57 1.227-1.224 3.568 3.568 3.57-3.567 1.224 1.225-3.568 3.57zM10 18.272c4.568 0 8.272-3.704 8.272-8.272S14.568 1.728 10 1.728 1.728 5.432 1.728 10 5.432 18.272 10 18.272z" fill-rule="evenodd" />
        </symbol>
    </svg>
    <form novalidate="novalidate" onsubmit="return false;" class="searchbox sbx-custom">
        <div role="search" class="sbx-custom__wrapper">
            <input type="search" name="search" id="search"  onkeyup={ search } placeholder="Search your website" autocomplete="off" required="required" class="sbx-custom__input">
            <button type="submit" title="Submit your search query." class="sbx-custom__submit">
                <svg role="img" aria-label="Search">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-1"></use>
                </svg>
            </button>
            <button type="reset" title="Clear the search query." class="sbx-custom__reset">
                <svg role="img" aria-label="Reset">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-5"></use>
                </svg>
            </button>
        </div>
        <div show={this.suggestions} id="suggestions">
            <ul>
                <li if={spellcheck.length > 0}><b>Did you mean: <i>{ spellcheck[0].word }</i> ?</b></li>
                <li each={suggestions}>
                    { term }
                </li>
            </ul>
        </div>
    </form>

    <script>
        this.suggestions = [];
        this.spellcheck = [];

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

        this.search = (e) =>  {
            var self = this;
            this.rest
                .find({query:{ $suggest: e.target.value}})
                .then(res => {
                    console.log('res', e.target.value, res, res.suggestions, res.spellcheck);
                    console.log('item', typeof res.suggest.suggest[e.target.value].suggestions);
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
                    console.log('suggest err ???',err)
                })
        }

    </script>

    <style>
        #suggestions ul {
            list-style: none;
            text-align: left;
            color:#1f8dd6;
            padding: 0;
            margin: 0 0 0 50px;
            font-size: 14px;
            text-transform: none;
        }
        /*******************************************************************************/
        .sbx-custom {
          display: inline-block;
          position: relative;
          width: 60%;
          height: 51px;
          white-space: nowrap;
          box-sizing: border-box;
          font-size: 22px;
          opacity: 0.7;
        }
        .sbx-custom:hover,
        .sbx-custom:active,
        .sbx-custom:focus
        {
            opacity: 1;
        }
        .sbx-custom__wrapper {
          width: 100%;
          height: 100%;
        }

        .sbx-custom__input {
          display: inline-block;
          -webkit-transition: box-shadow .4s ease, background .4s ease;
          transition: box-shadow .4s ease, background .4s ease;
          border: 0;
          border-radius: 26px;
          box-shadow: inset 0 0 0 2px #000000;
          background: #000000;
          padding: 0;
          padding-right: 41px;
          padding-left: 51px;
          width: 100%;
          height: 100%;
          vertical-align: middle;
          white-space: normal;
          font-size: inherit;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          color:#1f8dd6;
        }

        .sbx-custom__input::-webkit-search-decoration, .sbx-custom__input::-webkit-search-cancel-button, .sbx-custom__input::-webkit-search-results-button, .sbx-custom__input::-webkit-search-results-decoration {
          display: none;
        }

        .sbx-custom__input:hover {
          box-shadow: inset 0 0 0 2px black;
        }

        .sbx-custom__input:focus, .sbx-custom__input:active {
          outline: 0;
          box-shadow: inset 0 0 0 1px #1f8dd6;
          /* background: #808080; */
        }

        .sbx-custom__input::-webkit-input-placeholder {
          color: #7A7A7A;
        }

        .sbx-custom__input::-moz-placeholder {
          color: #7A7A7A;
        }

        .sbx-custom__input:-ms-input-placeholder {
          color: #7A7A7A;
        }

        .sbx-custom__input::placeholder {
          color: #7A7A7A;
        }

        .sbx-custom__submit {
          position: absolute;
          top: 0;
          right: inherit;
          left: 0;
          margin: 0;
          border: 0;
          border-radius: 25px 0 0 25px;
          background-color: rgba(255, 255, 255, 0);
          padding: 0;
          width: 51px;
          height: 100%;
          vertical-align: middle;
          text-align: center;
          font-size: inherit;
          -webkit-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
        }

        .sbx-custom__submit::before {
          display: inline-block;
          margin-right: -4px;
          height: 100%;
          vertical-align: middle;
          content: '';
        }

        .sbx-custom__submit:hover, .sbx-custom__submit:active {
          cursor: pointer;
        }

        .sbx-custom__submit:focus {
          outline: 0;
        }

        .sbx-custom__submit svg {
          width: 19px;
          height: 19px;
          vertical-align: middle;
          fill: #6B6870;
        }

        .sbx-custom__reset {
          display: none;
          position: absolute;
          top: 12px;
          right: 12px;
          margin: 0;
          border: 0;
          background: none;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
          -webkit-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
          fill: rgba(0, 0, 0, 0.5);
        }

        .sbx-custom__reset:focus {
          outline: 0;
        }

        .sbx-custom__reset svg {
          display: block;
          margin: 4px;
          width: 19px;
          height: 19px;
        }

        .sbx-custom__input:valid ~ .sbx-custom__reset {
          display: block;
          -webkit-animation-name: sbx-reset-in;
                  animation-name: sbx-reset-in;
          -webkit-animation-duration: .15s;
                  animation-duration: .15s;
        }

        @-webkit-keyframes sbx-reset-in {
          0% {
            -webkit-transform: translate3d(-20%, 0, 0);
                    transform: translate3d(-20%, 0, 0);
            opacity: 0;
          }
          100% {
            -webkit-transform: none;
                    transform: none;
            opacity: 1;
          }
        }

        @keyframes sbx-reset-in {
          0% {
            -webkit-transform: translate3d(-20%, 0, 0);
                    transform: translate3d(-20%, 0, 0);
            opacity: 0;
          }
          100% {
            -webkit-transform: none;
                    transform: none;
            opacity: 1;
          }
        }
    </style>

</autocomplete>