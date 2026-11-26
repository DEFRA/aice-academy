const resetAfterMs = 3000

/**
 * Adds a Copy button under every prompt and command block, so learners don't
 * have to retype them. Without JavaScript, or without clipboard access, the
 * text can still be selected and copied by hand.
 * @param {ParentNode} root
 */
export function initCopyButtons(root = document) {
  if (!navigator.clipboard?.writeText) {
    return
  }

  root.querySelectorAll('pre.app-code-block').forEach((block) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'app-copy'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'govuk-button govuk-button--secondary app-copy__button'
    button.innerHTML =
      'Copy<span class="govuk-visually-hidden"> this text</span>'

    const status = document.createElement('span')
    status.className = 'govuk-visually-hidden'
    status.setAttribute('aria-live', 'polite')

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.textContent.trim())
        button.firstChild.textContent = 'Copied'
        status.textContent = 'Copied to your clipboard'
      } catch {
        button.firstChild.textContent = 'Select the text to copy it'
      }

      window.setTimeout(() => {
        button.firstChild.textContent = 'Copy'
        status.textContent = ''
      }, resetAfterMs)
    })

    block.parentNode.insertBefore(wrapper, block)
    wrapper.append(block, button, status)
  })
}
