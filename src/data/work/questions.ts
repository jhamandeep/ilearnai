import { workExamples } from './examples'

// Plausible mistakes tied to each fictional scenario, rather than AI trivia.
const alternatives: Record<string, [string, string]> = {
  'banking/service-assistant': ['Use the old guide if its title matches; the citation is sufficient.', 'Keep the answer and remove the version number so it is easier to read.'],
  'banking/document-check': ['Use the average income from similar applications and label the checklist complete.', 'Copy the income from the first application with a matching surname.'],
  'banking/fraud-review': ['Yes. Fewer alerts is sufficient evidence that accuracy improved.', 'Yes, provided the highest-scored alert was reviewed first.'],
  'insurance/claim-intake': ['Yes. The absence of a photograph establishes that the damage was absent.', 'Assume the repair estimate also proves that photographs were supplied.'],
  'insurance/policy-explanation': ['Keep it: a short explanation should leave out exceptions.', 'Include the exclusion only if the reader asks a follow-up question.'],
  'insurance/claim-anomalies': ['A high score without the underlying invoices, so the reviewer stays unbiased.', 'Automatically rejecting the newer claim whenever two invoices look similar.'],
  'healthcare/visit-note': ['Yes, if the rest of the note reads consistently.', 'Choose the most common date in similar notes to finish the record.'],
  'healthcare/service-information': ['Answer using the closest wording in the service directory.', 'Treat the opening-hours page as enough evidence for clinical advice.'],
  'healthcare/appointment-demand': ['Yes. Booking records always measure all underlying patient need.', 'Yes, as long as the unbooked slots are counted accurately.'],
  'retail/product-content': ['Borrow the feature from a visually similar product.', 'Add the feature if it makes the description more persuasive.'],
  'retail/stock-forecast': ['Yes. The most recent week is always the best forecast.', 'Order more than 75 because every increase must represent a lasting trend.'],
  'retail/store-assistant': ['Yes. A listed product must still be available in every store.', 'Yes, if the product description was updated recently.'],
  'manufacturing/maintenance-alerts': ['Yes. Any deviation from baseline means a physical fault.', 'Yes. Ignore the operating-mode change because the sensor value is numerical.'],
  'manufacturing/visual-inspection': ['Only the camera price matters; all cameras produce equivalent inputs.', 'A new camera always improves detection, so testing can be skipped.'],
  'manufacturing/technician-guide': ['Yes, when the other machine has a similar product name.', 'Yes, as long as the combined instructions read fluently.'],
  'education/lesson-materials': ['Keep it because more color always means more learning.', 'Change the learning objective to match the generated activity.'],
  'education/feedback-drafts': ['Yes. Missing evidence proves the student did not try.', 'Yes, if the inferred reason makes the feedback sound personal.'],
  'education/student-information': ['Predict approval using the general page and present it as a decision.', 'Promise approval when the student completes every form field.'],
  'public-services/resident-guidance': ['Yes. Everyone can use the same digital channel.', 'Yes, if the form has a modern visual design.'],
  'public-services/case-summary': ['Yes. A complete-looking chronology is more useful than an explicit gap.', 'Use the date of the following letter as the event date.'],
  'public-services/consultation-themes': ['Yes. The largest group is the only one that can affect the decision.', 'Merge the smaller accessibility group into parking without noting the difference.'],
  'professional-services/proposal-draft': ['Yes. An earlier successful outcome guarantees the next one.', 'Yes, if the previous case study belongs to the same industry.'],
  'professional-services/policy-comparison': ['Yes. Similar words mean the same obligations.', 'Yes, if the document has the same number of pages.'],
  'professional-services/employee-help': ['Yes. A general procedure authorises the helper to settle disputed cases.', 'Yes, if the employee supplies a convincing explanation.'],
  'technology/test-drafts': ['Yes. A successful test run proves the feature is correct.', 'Yes, if the test calls the intended function at least once.'],
  'technology/incident-brief': ['Yes. An event immediately before an error must be its cause.', 'Yes, if the timeline includes a link to the deployment.'],
  'technology/support-routing': ['Pick the most common service and hide the uncertainty.', 'Send the ticket to every team without asking for the missing detail.'],
  'logistics/delay-warning': ['Yes. Missing tracking data proves the vehicle is physically late.', 'Yes. Use the average delay as a guaranteed arrival time.'],
  'logistics/shipment-documents': ['Yes. The average is a neutral way to settle conflicting records.', 'Replace the lower quantity with the higher one without checking.'],
  'logistics/dispatch-options': ['Yes. A cheaper plan outweighs a capacity restriction.', 'Yes, if the capacity excess is omitted from the summary.'],
  'energy/demand-forecast': ['Yes. A narrow interval always means the model is accurate.', 'Yes, if the predicted number has more decimal places.'],
  'energy/asset-inspection': ['Interpret the darkest area as a confirmed fault.', 'Record the asset as normal because no clear fault is visible.'],
  'energy/field-knowledge': ['Yes, if both assets are in the same product family.', 'Combine both procedures and remove their identifiers.'],
  'agriculture/field-observations': ['Yes. Similar colors prove an identical cause.', 'Yes, even when crop and location are different.'],
  'agriculture/water-planning': ['Yes. No reading means the sensor detected no water.', 'Replace the missing value with zero to keep the plan precise.'],
  'agriculture/food-quality-records': ['Yes, if the surrounding measurements were normal.', 'Fill the interval with a typical value and mark the log complete.'],
}

export function workQuestion(key: string) {
  const example = workExamples[key]
  const wrong = alternatives[key]
  if (!example || !wrong) return undefined
  const correct = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3
  const options = [...wrong]
  options.splice(correct, 0, example.answer)
  return { prompt: example.question, options, correct, explanation: example.lesson }
}
