<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6">
        <CardWrapper :title="$t('customer.create.title')" body-class="h-100">
          <form id="customerForm">
            <AppInput
              v-model="customerData.name"
              type="text"
              name="customerName"
              :label="$t('customer.create.form.name')"
              :is-required="true"
            />

            <AppInput
              v-model="customerData.phone"
              name="customerPhone"
              :label="$t('customer.create.form.phone')"
              :is-required="true"
            />

            <AppTextarea
              v-model="customerData.address"
              name="customerAddress"
              :label="$t('customer.create.form.address')"
              :rows="2"
            />

            <div class="d-flex gap-2 flex-wrap">
              <AppButton
                button-class="btn-primary"
                type="submit"
                :title="$t('customer.create.actions.create')"
              />
              <AppButton
                button-class="btn-secondary"
                :title="$t('customer.create.actions.clear')"
              />
            </div>
          </form>
        </CardWrapper>
      </div>

      <div class="col-lg-6">
        <CardWrapper :title="$t('customer.create.recent-customers')" body-class="p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">{{ $t('customer.create.table.name') }}</th>
                  <th scope="col">{{ $t('customer.create.table.phone') }}</th>
                  <th scope="col">{{ $t('customer.create.table.address') }}</th>
                  <th scope="col">{{ $t('customer.create.table.actions') }}</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </CardWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'

const customerData = ref({
  name: '',
  phone: '',
  address: ''
})
</script>

<style lang="scss" scoped></style>
