<template>
  <div class="card-view min-h-full w-full flex flex-col sm:flex-row">
    <div
      class="min-w-64 sticky top-0 sm:border-r border-gray-400 bg-gray-200 shadow sm:shadow-none"
    >
      <div class="sticky top-0 flex flex-col items-center p-4 sm:p-8">
        <slot name="side"></slot>
      </div>
    </div>

    <div class="flex flex-wrap flex-grow py-8 px-2 sm:px-6">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
