<template>
  <CardWrapper :title="$t(`${PATH_LANG}.title`)" card-class="position-relative" body-class="h-100">
    <Loading key-loading="CUSTOMER_CREATE_FORM" />
    <AppInput
      v-model="formData.name"
      type="text"
      name="name"
      :max-length="100"
      :label="$t(`${PATH_LANG}.form.name`)"
      :is-required="true"
      :error="errors.name"
    />

    <AppInput
      v-model="formData.phone"
      name="phone"
      type="tel"
      :max-length="20"
      :label="$t(`${PATH_LANG}.form.phone`)"
      :is-required="true"
      :error="errors.phone"
    />

    <AppTextarea
      v-model="formData.address"
      name="address"
      :label="$t(`${PATH_LANG}.form.address`)"
      :rows="3"
      :max-length="255"
      :error="errors.address"
    />

    <div class="d-flex gap-2 justify-content-end">
      <AppButton
        button-class="btn-primary"
        :title="$t(`${PATH_LANG}.actions.create`)"
        @click="onCreate"
      />
      <AppButton
        button-class="btn-secondary"
        :title="$t(`${PATH_LANG}.actions.clear`)"
        @click="onClear"
      />
    </div>
  </CardWrapper>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import Loading from '@renderer/components/loading/Loading.vue'
import { showSuccessToast } from '@renderer/components/toast'
import { useCustomerCreateStore } from './customer-create.store'
import { useCustomerCreateValidation } from './customer-create.validate'
import type { ICustomerForm } from './customer-create.type'

const { t } = useI18n()
const PATH_LANG = 'modules.customer.create'

const formData = ref({} as ICustomerForm)
const { errors, validateAll, resetErrors } = useCustomerCreateValidation(formData)
const { isSuccess, createCustomer } = useCustomerCreateStore()

const onCreate = async () => {
  const isValid = await validateAll()
  if (isValid) {
    createCustomer(formData.value)
  }
}

const onClear = () => {
  formData.value = {}
}

watch(
  () => isSuccess.value,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      resetErrors()
      onClear()
      showSuccessToast(t(`${PATH_LANG}.success.message`))
    }
  }
)
</script>

<style lang="scss" scoped></style>
