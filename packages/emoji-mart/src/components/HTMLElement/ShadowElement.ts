// @ts-nocheck
import { HTMLElement } from '.'

export default class ShadowElement extends HTMLElement {
  constructor(props, { styles } = {}) {
    super(props)

    this.setShadow()
    this.injectStyles(styles)
  }

  setShadow() {
    this.attachShadow({ mode: 'open' })
  }

  injectStyles(styles) {
    if (!styles) return

    const style = document.createElement('style')
    const wxemStyles =
      document.querySelector('style[data-wxemoji="true"]')?.innerText ?? ''

    style.textContent = `${wxemStyles}${styles}`
    this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild)
  }
}
