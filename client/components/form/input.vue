<template>
  <label for="name" class="flex flex-col items-start">
    <span class="px-3 py-1 rounded-t text-sm text-gray-900 bg-white shadow">
      {{ label }}
    </span>
    <input
      :id="name"
      :type="type"
      :name="name"
      :value="value"
      class="w-full mb-4 px-3 py-2 appearance-none rounded-r rounded-b border-t-1 border-gray-200 focus:border-gray-200 text-gray-900 bg-gray-200 focus:bg-white shadow transition"
      @input="input"
    />
  </label>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from 'vue-property-decorator'

@Component
export default class AppInput extends Vue {
  @Prop(String) readonly type!: string
  @Prop(String) readonly name!: string
  @Prop(String) readonly label!: string
  @Prop([String, Number]) value!: string

  @Emit()
  input({ target: { value } }) {
    return value
  }
}
</script>
