<template>
    <Teleport to="body">
        <TransitionGroup name="n-msg" tag="div" class="n-msg-container">
            <div v-for="msg in messages" :key="msg.id" :class="['n-msg', `n-msg--${msg.type}`]">
                <span class="n-msg__icon">{{ iconMap[msg.type] }}</span>
                <span class="n-msg__text">{{ msg.text }}</span>
            </div>
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
const { messages } = useMessage()

const iconMap: Record<string, string> = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕',
}
</script>

<style scoped>
.n-msg-container {
    position: fixed;
    top: 72px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
}

.n-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    pointer-events: auto;
    white-space: nowrap;
}

.n-msg--info {
    background: var(--n-color-info-light);
    color: var(--n-color-info-text);
    border: 1px solid var(--n-color-info-border);
}

.n-msg--success {
    background: var(--n-color-success-light);
    color: var(--n-color-success-text);
    border: 1px solid var(--n-color-success-border);
}

.n-msg--warning {
    background: var(--n-color-warning-light);
    color: var(--n-color-warning-text);
    border: 1px solid var(--n-color-warning-border);
}

.n-msg--error {
    background: var(--n-color-danger-light);
    color: var(--n-color-danger-text);
    border: 1px solid var(--n-color-danger-border);
}

.n-msg__icon {
    font-size: 16px;
    font-weight: 700;
}

/* transition */
.n-msg-enter-active {
    transition: all 0.3s ease-out;
}

.n-msg-leave-active {
    transition: all 0.25s ease-in;
}

.n-msg-enter-from {
    opacity: 0;
    transform: translateY(-12px);
}

.n-msg-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

.n-msg-move {
    transition: transform 0.25s ease;
}
</style>
