<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6">
        <CardWrapper :title="$t('repair.create.basicInfo')">
          <AppInput
            v-model="repairData.repairDate"
            type="date"
            name="repairDate"
            :label="$t('repair.create.form.repairDate')"
            :is-required="true"
          />

          <AppInput
            v-model="repairData.completionDate"
            type="date"
            name="completionDate"
            :label="$t('repair.create.form.completionDate')"
          />

          <AppInput
            v-model="repairData.customerName"
            type="text"
            name="customerName"
            list="customersList"
            :label="$t('repair.create.form.customer')"
            :is-required="true"
          />
          <datalist id="customersList"></datalist>

          <AppTextarea
            v-model="repairData.description"
            :label="$t('repair.create.form.description')"
            :is-required="true"
            name="repairDescription"
            :rows="2"
          />

          <AppInput
            v-model="repairData.amount"
            type="number"
            name="amountDue"
            min="0"
            step="1000"
            :label="$t('repair.create.form.amount')"
            :is-required="true"
          />

          <AppSelect
            v-model="repairData.warrantyDuration"
            name="warrantyDuration"
            :label="$t('repair.create.form.warrantyDuration')"
            :is-required="false"
            :options="warrantyOptions"
            :has-blank-option="false"
          />
        </CardWrapper>
      </div>

      <div class="col-lg-6">
        <div class="row g-3">
          <div class="col-12">
            <CardWrapper :title="$t('repair.create.warranty.title')">
              <div class="warranty-table">
                <div class="row g-2 mb-2 fw-bold small text-muted">
                  <div class="col-4">{{ $t('repair.create.warranty.date') }}</div>
                  <div class="col-5">{{ $t('repair.create.warranty.content') }}</div>
                  <div class="col-3">{{ $t('repair.create.warranty.actions') }}</div>
                </div>
                <!-- <AppButton
                  :title="$t('repair.create.warranty.add')"
                  button-class="btn-outline-primary btn-sm mt-2"
                  title-class="ms-1"
                /> -->
              </div>
            </CardWrapper>
          </div>

          <div class="col-12">
            <CardWrapper :title="$t('repair.create.payment.title')">
              <div class="payment-table">
                <div class="row g-2 mb-2 fw-bold small text-muted">
                  <div class="col-3">{{ $t('repair.create.payment.method') }}</div>
                  <div class="col-3">{{ $t('repair.create.payment.amount') }}</div>
                  <div class="col-3">{{ $t('repair.create.payment.date') }}</div>
                  <div class="col-3">{{ $t('repair.create.payment.actions') }}</div>
                </div>
                <!-- <AppButton
                  button-class="btn-outline-primary btn-sm mt-2"
                  title-class="ms-1"
                  :title="$t('repair.create.payment.add')"
                /> -->
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>
    </div>

    <CardWrapper card-class="mt-3" body-class="text-end">
      <AppButton
        button-class="btn-primary btn-lg px-4"
        :title="$t('repair.create.actions.submit')"
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

const { t } = useI18n()

const repairData = ref({
  repairDate: '',
  completionDate: '',
  customerName: '',
  description: '',
  amount: 0,
  warrantyDuration: ''
})

const warrantyOptions = computed(() => [
  { key: t('repair.create.warrantyOptions.3months'), value: '3' },
  { key: t('repair.create.warrantyOptions.6months'), value: '6' }
])
</script>

<style lang="scss" scoped>
.warranty-table,
.payment-table {
  .row {
    border-bottom: 1px solid #dee2e6;
    padding: 0.5rem 0;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
