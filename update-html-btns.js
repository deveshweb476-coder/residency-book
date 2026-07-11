const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace Hero buttons
html = html.replace(
`<a href="https://www.amazon.in" target="_blank" rel="noopener" class="hpb-btn" id="amazon-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.869-1.234-1.274-1.814-2.106-1.734 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.548.582l-3.061-.329c-.259-.057-.548-.266-.472-.661C6.97.996 9.929 0 12.567 0c1.347 0 3.107.359 4.168 1.381 1.347 1.258 1.219 2.938 1.219 4.764v4.314c0 1.297.538 1.867 1.045 2.568.178.25.217.547-.01.733-.566.472-1.571 1.353-2.124 1.845h.279z" />
                </svg>
                Order Now &nbsp;&#8964;
            </a>`,
`<div class="hero-buttons" style="display: flex; gap: 15px; flex-wrap: wrap;">
                <button class="hpb-btn btn-buy-direct" style="background: var(--gold); color: #000; border: none; cursor: pointer; border-radius: 4px;">
                    Buy E-Book Direct
                </button>
                <a href="https://www.amazon.in" target="_blank" rel="noopener" class="hpb-btn" id="amazon-btn" style="background: transparent; border-radius: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.869-1.234-1.274-1.814-2.106-1.734 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.548.582l-3.061-.329c-.259-.057-.548-.266-.472-.661C6.97.996 9.929 0 12.567 0c1.347 0 3.107.359 4.168 1.381 1.347 1.258 1.219 2.938 1.219 4.764v4.314c0 1.297.538 1.867 1.045 2.568.178.25.217.547-.01.733-.566.472-1.571 1.353-2.124 1.845h.279z" />
                    </svg>
                    Amazon
                </a>
            </div>`
);

// Replace Section 2 buttons
html = html.replace(
`<a href="https://www.amazon.in" target="_blank" rel="noopener" class="s2b-btn-amazon">Buy now from
                        Amazon</a>`,
`<button class="s2b-btn-amazon btn-buy-direct" style="background: var(--gold); color: #000; border: none; cursor: pointer; border-radius: 4px;">
                        Buy E-Book Direct
                    </button>
                    <a href="https://www.amazon.in" target="_blank" rel="noopener" class="s2b-btn-amazon" style="background: transparent; border-radius: 4px;">
                        Amazon
                    </a>`
);

fs.writeFileSync('index.html', html);
console.log('Updated index.html buttons');
