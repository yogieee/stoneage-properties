/**
 * Required fallback for the `@modal` parallel route slot. Without this,
 * refreshing any route (e.g. `/`) after the modal was previously opened
 * in-session produces a 404 for the unmatched `@modal` slot — the
 * documented failure mode from 02-RESEARCH.md Pitfall 1.
 */
export default function ModalDefault() {
  return null;
}
