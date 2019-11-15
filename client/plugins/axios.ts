import { Plugin, Context } from '@nuxt/types'
import { AxiosInstance, AxiosError, AxiosAdapter, AxiosResponse, AxiosStatic, AxiosInterceptorManager } from 'axios'

declare module 'vue/types/vue' {
    interface Vue {
        $axios: AxiosInstance
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $axios: AxiosInstance
    }
}

declare module 'vuex/types/index' {
    interface Store<S> {
        $axios: AxiosInstance
    }
}

export default ({ $axios, redirect }: Context & { $axios: any }) => {
    $axios.onError((error: AxiosError) => {
        const code = error.response && error.response.status
        if (code === 401) {
            redirect('/login')
        }
    })
}