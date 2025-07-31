<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6 h-100">
        <CardWrapper :title="$t(`${PATH_LANG}.basic-info`)" card-body="h-100">
          <AppInput
            v-model="formData.basicInfo.repair_date"
            type="date"
            name="repair_date"
            :label="$t(`${PATH_LANG}.form.repair-date`)"
            :is-required="true"
          />
          <AppInput
            v-model="formData.basicInfo.customer_phone"
            type="text"
            name="customer_phone"
            :label="$t(`${PATH_LANG}.form.customer-phone`)"
            :is-required="true"
          />
          <AppTextarea
            v-model="formData.basicInfo.description"
            :label="$t(`${PATH_LANG}.form.description`)"
            :is-required="true"
            name="repairDescription"
            :rows="2"
          />
          <AppInput
            v-model="formData.basicInfo.cost"
            type="number"
            name="cost"
            min="0"
            step="1000"
            :label="$t(`${PATH_LANG}.form.amount`)"
            :is-required="true"
          />
          <AppSelect
            v-model="formData.basicInfo.warranty_period"
            name=".warranty_period"
            :label="$t(`${PATH_LANG}.form.warranty-duration`)"
            :is-required="false"
            :options="warrantyOptions"
          />
        </CardWrapper>
      </div>

      <div class="col-lg-6">
        <div class="row g-3">
          <div class="col-12">
            <PaymentTable v-model="formData.payments" />
          </div>

          <div class="col-12">
            <WarrantyTable v-model="formData.warranties" />
          </div>
        </div>
      </div>
    </div>

    <CardWrapper card-class="mt-3" body-class="text-end">
      <AppButton
        button-class="btn-primary btn-lg px-4"
        :title="$t(`${PATH_LANG}.actions.submit`)"
      />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import PaymentTable from './components/repair-create-payment-table.vue'
import WarrantyTable from './components/repair-create-warranty-table.vue'
import type { IBasicRepairInfo, IRepairCreateForm } from './repair-create.type'

const { t } = useI18n()

const PATH_LANG = 'modules.repair.create'

const formData = ref<IRepairCreateForm>({
  basicInfo: {} as IBasicRepairInfo,
  payments: [],
  warranties: []
} as IRepairCreateForm)

const warrantyOptions = computed(() => [
  { key: t(`${PATH_LANG}.warranty-options.3-months`), value: '3' },
  { key: t(`${PATH_LANG}.warranty-options.6-months`), value: '6' }
])
</script>

<style lang="scss" scoped></style>
