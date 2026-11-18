import test from 'node:test';
import assert from 'node:assert/strict';
import { replaceMarkup } from '../js/view.js';
function fixture(disabled = false) {
  let focused;
  const active = {id:'',dataset:{action:'option-quantity',delta:'1'}};
  const plus = {id:'',dataset:{...active.dataset},disabled,focus(){focused='plus';}};
  const minus = {id:'',dataset:{action:'option-quantity',delta:'-1'},disabled:false,focus(){focused='minus';}};
  const container = {ownerDocument:{activeElement:active},contains:node=>node===active,querySelectorAll:()=>[minus,plus],innerHTML:''};
  return {container,focused:()=>focused};
}
test('same-screen replacement restores the active option control', () => {
  const f=fixture(); replaceMarkup(f.container, '<button>new options</button>'); assert.equal(f.focused(),'plus');
});
test('quantity limit moves focus to the remaining enabled quantity button', () => {
  const f=fixture(true); replaceMarkup(f.container, '<button>limit</button>'); assert.equal(f.focused(),'minus');
});
