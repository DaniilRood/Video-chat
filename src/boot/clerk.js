import { boot } from "quasar/wrappers";
import { clerkPlugin } from 'vue-clerk'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}
export default boot(({app}) => {
    app.use(clerkPlugin, {
        publishableKey: PUBLISHABLE_KEY
    });
});