<template>
  <span class="relative flex flex-col items-center">
    <button :class="buttonClass" aria-label="Share" @click="share">
      <slot>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          :class="`h-${size} text-${color} fill-current`"
        >
          <path
            d="M5.08 12.16A2.99 2.99 0 0 1 0 10a3 3 0 0 1 5.08-2.16l8.94-4.47a3 3 0 1 1 .9 1.79L5.98 9.63a3.03 3.03 0 0 1 0 .74l8.94 4.47A2.99 2.99 0 0 1 20 17a3 3 0 1 1-5.98-.37l-8.94-4.47z"
          />
        </svg>
      </slot>
    </button>
    <div
      class="absolute p-2 rounded bg-gray-800 shadow z-20 text-sm"
      :class="{
        'hidden mt-0': !isCopied,
        'block mt-12': isCopied,
      }"
    >
      Copied!
    </div>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppShare extends Vue {
  private static readonly CANNOT_SHARE =
    'Cannot share URL. Please copy and paste it yourself.'

  isCopied = false

  @Prop({ type: String }) subject?: string
  @Prop({ type: String }) text?: string
  @Prop({ type: String }) url?: string

  @Prop({ type: String, default: 4 }) buttonClass: string
  @Prop({ type: Number, default: 4 }) size: number
  @Prop({ type: String, default: 'white' }) color: string

  get hasShareAPI() {
    return 'share' in window.navigator
  }

  get hasClipboardAPI() {
    return 'clipboard' in window.navigator
  }

  showCopied() {
    this.isCopied = true
    setTimeout(() => {
      this.isCopied = false
    }, 1500)
  }

  async share() {
    const { subject: title, text, url } = this

    try {
      if (this.hasShareAPI) {
        // @ts-ignore
        await window.navigator.share({
          title: document.title,
          text: `${title}\n\n${text}\n\n`,
          url,
        })
      } else if (this.hasClipboardAPI) {
        await window.navigator.clipboard.writeText(
          `${title}\n\n${text}\n\n${url}`,
        )
        this.showCopied()
      } else {
        alert(AppShare.CANNOT_SHARE)
      }
    } catch (e) {
      // Don't do anything with the error.
    }
  }
}
</script>
