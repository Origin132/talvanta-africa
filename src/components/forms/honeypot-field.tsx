export function HoneypotField() {
  return <div className="sr-only" aria-hidden="true">
    <label htmlFor="websiteConfirmation">Leave this field blank</label>
    <input id="websiteConfirmation" name="websiteConfirmation" type="text" tabIndex={-1} autoComplete="off" />
  </div>;
}
