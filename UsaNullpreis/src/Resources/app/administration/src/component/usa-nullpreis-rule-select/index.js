import template from './template.html.twig';

const { Component } = Shopware;

Component.register('usa-nullpreis-rule-select', {
    template,

    props: {
        value: { required: false, default: null },
        disabled: { type: Boolean, required: false, default: false },
        label: { type: String, required: false, default: null },
        helpText: { type: String, required: false, default: null },
    },

    computed: {
        currentValue: {
            get() {
                return this.value ?? null;
            },
            set(val) {
                const id = (val && typeof val === 'object') ? val.id : val;
                const normalized = id || null;

                this.$emit('input', normalized);
                this.$emit('change', normalized);
            },
        },
    },
});
