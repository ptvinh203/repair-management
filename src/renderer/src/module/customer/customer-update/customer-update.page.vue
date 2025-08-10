<template>
  <CardWrapper :title="$t(`${PATH_LANG}.title`)" card-class="position-relative h-100">
    <Loading key-loading="CUSTOMER_UPDATE_FORM" />
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
        button-class="btn-secondary"
        :title="$t(`${PATH_LANG}.actions.cancel`)"
        @click="onCancel"
      />
      <AppButton
        button-class="btn-primary"
        :title="$t(`${PATH_LANG}.actions.update`)"
        @click="onUpdate"
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
import { showConfirmModal, showInfoModal } from '@renderer/components/modal'
import { useCustomerUpdateStore } from './customer-update.store'
import { useCustomerUpdateValidation } from './customer-update.validate'
import type { ICustomerForm } from './customer-update.type'

const props = defineProps<{ customer: ICustomerForm }>()

const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const PATH_LANG = 'modules.customer.update'

const formData = ref<ICustomerForm>({ ...props.customer })

const { errors, validateAll, resetErrors } = useCustomerUpdateValidation(formData)
const { isSuccess, updateCustomer } = useCustomerUpdateStore()

const onUpdate = async () => {
  const isValid = await validateAll()
  if (isValid) {
    const isChange = JSON.stringify(formData.value) !== JSON.stringify(props.customer)
    if (!isChange) {
      showInfoModal(t(`${PATH_LANG}.success.no-change`))

      return
    }

    const isConfirmed = await showConfirmModal()
    if (isConfirmed) {
      updateCustomer(formData.value.id, formData.value)
    }
  }
}

const onCancel = () => {
  emit('cancel')
}

watch(
  () => isSuccess.value,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      resetErrors()
      showSuccessToast(t(`${PATH_LANG}.success.message`))
      emit('updated')
    }
  }
)

watch(
  () => props.customer,
  (newCustomer) => {
    formData.value = { ...newCustomer }
    resetErrors()
  }
)
</script>

<style lang="scss" scoped></style>
