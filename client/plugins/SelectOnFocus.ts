import Vue from 'vue'
import { DirectiveBinding } from 'vue/types/options';

const selectOnFocus = (el: HTMLElement, binding: DirectiveBinding) => {
    const defaultRange = {
        start: 0,
        end: -1,
        ...binding.value
    };

    el.addEventListener("focus", (e: any) => {
        const start = parseInt(defaultRange.start, 10);
        const end = parseInt(defaultRange.end, 10);

        if (e.target.hasAttribute("contenteditable")) {
            selectNodeContents(e.target, start, end);
        } else {
            e.target.setSelectionRange(start, end);
        }
    });
}

const selectNodeContents = ($el: HTMLElement, start: number, end: number) => {
    let textNode = $el.childNodes[0];

    if (textNode && textNode.textContent) {
        let r = document.createRange();

        r.setStart(textNode, start);

        if (end < 0 || end > textNode.textContent.length) {
            end = textNode.textContent.length;
        }
        r.setEnd(textNode, end);

        let s = window.getSelection();
        if (s) {
            s.removeAllRanges();
            s.addRange(r);
        }
    }
};

Vue.directive("select-on-focus", selectOnFocus)