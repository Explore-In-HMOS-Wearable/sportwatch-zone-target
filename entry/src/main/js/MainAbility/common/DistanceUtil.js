const STRIDE_FACTOR = 0.414;

function stepsToMeters(steps, heightCm) {
    const strideMeters = (heightCm / 100) * STRIDE_FACTOR;
    return Math.round(steps * strideMeters)
}

export const distanceUtil = {
    fromSteps: stepsToMeters
};