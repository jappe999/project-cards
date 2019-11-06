<template>
  <label
    class="h-full flex items-center bg-gray-200 cursor-pointer select-none"
  >
    <input v-model="isChecked" type="checkbox" class="hidden" />
    <div
      class="h-4 w-4 flex items-center justify-center ml-2 my-2 p-1"
      :class="{
        'bg-gray-700 text-white': isChecked,
        'bg-gray-300': !isChecked,
      }"
    >
      <svg
        v-if="isChecked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="h-3 fill-current"
      >
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    </div>
    <span class="p-2"><slot /></span>
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppLabelledCheckbox extends Vue {
  get isChecked(): boolean {
    return this.value
  }
  set isChecked(value) {
    this.$emit('input', value)
  }

  @Prop({ default: false, type: Boolean }) value!: boolean
}
</script>

<style lang="postcss"></style>
