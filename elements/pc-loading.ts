import { customElement, html } from 'functional-element';

// TODO all of this prefix nonsense can be fixed by implementing shadow dom in functional-element
customElement('pc-loading', ({ props, constructing }) => {
    
    if (constructing) {
        return {
            hidden: false,
            prefix: ''
        };
    }

    return html`
        <!-- The spinner code has the following two licenses -->
        <!--
        Copyright (c) 2018 by Scott Kellum (https://codepen.io/scottkellum/pen/tzjCK)
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        -->
        
        <!--
        Copyright (c) 2018 by Scott Kellum (https://codepen.io/scottkellum/pen/tzjCK)
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        -->           
        <style>
            .${props.prefix}loading-container {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                right: 0;
                background-color: ${props.hidden ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)'};
                z-index: 0;
                transition: background-color 1s linear;
                pointer-events: none;
                text-align: center;
            }

            .${props.prefix}loading-spinner {
                display: inline-block;
                width: 50px;
                height: 50px;
                border: 3px solid rgba(0, 0, 0, .3);
                border-radius: 50%;
                border-top-color: #fefefe;
                animation: spin 1s ease-in-out infinite;
                margin-top: 30vh;
            }

            .${props.prefix}loading-spinner[hidden] {
                display: none;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>

        <div class="${props.prefix}loading-container">
            <div class="${props.prefix}loading-spinner" ?hidden=${props.hidden}></div>
        </div>
    `;
});