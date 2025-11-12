import { VisualFeatureCategory } from '../../types';

// In a real application, the `preview` property would be a URL to an image.
// Here, we use a placeholder string. The `FeatureItem` component will render a visual placeholder.
export const visualLibrary: VisualFeatureCategory[] = [
    {
        id: 'faceShape',
        name: 'Face Shape',
        features: [
            { label: 'Oval', preview: 'oval-face', prompt: 'an oval face shape' },
            { label: 'Square', preview: 'square-face', prompt: 'a square face shape' },
            { label: 'Round', preview: 'round-face', prompt: 'a round face shape' },
            { label: 'Heart', preview: 'heart-face', prompt: 'a heart-shaped face' },
        ],
    },
    {
        id: 'hairStyle',
        name: 'Hairstyles',
        features: [
            { label: 'Bald', preview: 'bald', prompt: 'a bald head' },
            { label: 'Buzzcut', preview: 'buzzcut', prompt: 'a buzzcut hairstyle' },
            { label: 'Short', preview: 'short-hair', prompt: 'short hair' },
            { label: 'Wavy', preview: 'wavy-hair', prompt: 'medium-length wavy hair' },
            { label: 'Long', preview: 'long-hair', prompt: 'long, straight hair' },
            { label: 'Curly', preview: 'curly-hair', prompt: 'short, curly hair' },
        ],
    },
    {
        id: 'facialHair',
        name: 'Facial Hair',
        features: [
            { label: 'Clean Shaven', preview: 'clean-shaven', prompt: 'a clean-shaven face, no facial hair' },
            { label: 'Stubble', preview: 'stubble', prompt: 'light stubble facial hair' },
            { label: 'Mustache', preview: 'mustache', prompt: 'a prominent mustache' },
            { label: 'Goatee', preview: 'goatee', prompt: 'a goatee' },
            { label: 'Full Beard', preview: 'full-beard', prompt: 'a full beard' },
        ],
    },
    {
        id: 'eyebrows',
        name: 'Eyebrows',
        features: [
            { label: 'Arched', preview: 'arched-brows', prompt: 'arched eyebrows' },
            { label: 'Straight', preview: 'straight-brows', prompt: 'straight eyebrows' },
            { label: 'Rounded', preview: 'rounded-brows', prompt: 'rounded eyebrows' },
            { label: 'Angled', preview: 'angled-brows', prompt: 'angled, sharp eyebrows' },
        ],
    },
    {
        id: 'eyes',
        name: 'Eyes',
        features: [
            { label: 'Almond', preview: 'almond-eyes', prompt: 'almond-shaped eyes' },
            { label: 'Round', preview: 'round-eyes', prompt: 'round eyes' },
            { label: 'Hooded', preview: 'hooded-eyes', prompt: 'hooded eyes' },
            { label: 'Downturned', preview: 'downturned-eyes', prompt: 'downturned eyes' },
        ],
    },
    {
        id: 'nose',
        name: 'Nose',
        features: [
            { label: 'Straight', preview: 'straight-nose', prompt: 'a straight nose' },
            { label: 'Wide', preview: 'wide-nose', prompt: 'a wide nose' },
            { label: 'Hooked', preview: 'hooked-nose', prompt: 'a hooked nose' },
            { label: 'Button', preview: 'button-nose', prompt: 'a small button nose' },
        ],
    },
    {
        id: 'lips',
        name: 'Lip Shapes',
        features: [
            { label: 'Thin', preview: 'thin-lips', prompt: 'thin lips' },
            { label: 'Full', preview: 'full-lips', prompt: 'full lips' },
            { label: 'Bow-Shaped', preview: 'bow-lips', prompt: 'bow-shaped lips' },
        ],
    },
    {
        id: 'jawline',
        name: 'Jawlines',
        features: [
            { label: 'Sharp', preview: 'sharp-jaw', prompt: 'a sharp, defined jawline' },
            { label: 'Rounded', preview: 'rounded-jaw', prompt: 'a soft, rounded jawline' },
            { label: 'Square', preview: 'square-jaw', prompt: 'a square jawline' },
        ],
    },
    {
        id: 'accessories',
        name: 'Accessories',
        features: [
            { label: 'None', preview: 'none', prompt: 'no eyewear or headwear' },
            { label: 'Eyeglasses', preview: 'eyeglasses', prompt: 'wearing eyeglasses' },
            { label: 'Sunglasses', preview: 'sunglasses', prompt: 'wearing sunglasses' },
            { label: 'Baseball Cap', preview: 'baseball-cap', prompt: 'wearing a baseball cap' },
            { label: 'Beanie', preview: 'beanie', prompt: 'wearing a beanie' },
        ],
    },
];