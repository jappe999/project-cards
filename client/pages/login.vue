<template>
  <div class="w-full flex flex-col items-center">
    <app-card v-if="!$auth.loggedIn" class="w-full">
      <app-card-content>
        <h2 class="text-2xl font-bold">
          Sign in
        </h2>
        <hr class="w-full mt-2 mb-2 border-b border-gray" />

        <div v-if="user.errors.any()">
          <div
            v-for="[field, errors] in Object.entries(user.errors.all())"
            :key="field"
            class="px-3"
          >
            <small v-for="error in errors" :key="error">
              {{ error }}
            </small>
          </div>

          <hr class="w-full mt-2 mb-4 border-b border-gray" />
        </div>

        <form @submit.prevent="signIn">
          <app-input
            v-model="user.username"
            label="Username"
            name="username"
            required
          />
          <app-input
            v-model="user.password"
            label="Password"
            name="password"
            type="password"
          />

          <div class="flex justify-end">
            <app-button type="submit" class="font-bold" :loading="user.busy">
              Sign in
            </app-button>
          </div>
        </form>
      </app-card-content>
    </app-card>

    <small class="mt-4">You don't have to sign up. Just pick a username.</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from '~/plugins'
import { PlayerSignIn } from '~/models/Player'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppInput: () => import('~/components/form/input.vue'),
    AppButton: () => import('~/components/button/button.vue'),
  },
})
export default class SignIn extends Vue {
  $auth: any

  user = new Form<PlayerSignIn>({
    username: '',
    password: '',
  })

  async signIn() {
    this.user.startProcessing()

    try {
      await this.$auth.loginWith('local', { data: this.user.data() })
    } catch ({ response }) {
      if (response.status === 401) {
        this.user.errors.set('password', response.data.message)
      }
    } finally {
      this.user.finishProcessing()
    }
  }
}
</script>
