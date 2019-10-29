import { customElement, html } from 'functional-element';
import { 
    color1Full,
    one
 } from '../services/css';

// TODO all of this prename nonsense can be fixed by implementing shadow dom in functional-element
customElement('pc-loading', ({ 
    constructing,
    hidden,
    prename,
    message,
    spinnerWidth,
    spinnerHeight,
    spinnerMarginTop
 }) => {
    
    if (constructing) {
        return {
            hidden: false,
            prename: '',
            message: '',
            spinnerWidth: '50px',
            spinnerHeight: '50px',
            spinnerMarginTop: '30vh'
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
            .${prename}loading-container {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                right: 0;
                background-color: ${hidden ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)'};
                z-index: ${one};
                ${hidden ? 'transition: background-color 1s linear;' : ''}
                /* pointer-events: none; */
                text-align: center;
            }

            .${prename}loading-container {
                /* display: none; */
            }

            .${prename}loading-spinner {
                display: inline-block;
                width: ${spinnerWidth};
                height: ${spinnerHeight};
                border: 3px solid ${color1Full};
                border-radius: 50%;
                border-top-color: #fefefe;
                animation: spin 1s ease-in-out infinite;
                margin-top: ${spinnerMarginTop};
            }

            .${prename}loading-spinner[hidden] {
                display: none;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>

        <div class="${prename}loading-container">
            <div class="${prename}loading-spinner" ?hidden=${hidden}></div>
            <br>
            <br>
            <div style="font-family: Ubuntu; font-weight: bold" ?hidden=${hidden}>${message}</div>
        </div>
    `;
});