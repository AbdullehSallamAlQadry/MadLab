// app/diagnostics/[diagnosticId]/page.js
import diagnosticsData from '../diagnostics.json'; // example path
import DiagnosticMain from './main';

export default async function Page({ params }) {
  const { diagnosticId } = await params;
  const diagnostic = diagnosticsData
    .flatMap(group => group.items)
    .find(item => item.id === diagnosticId);
  if (!diagnostic) {
    return (
      <h1 className='w-full text-center mt-70 text-xl'>404 – Diagnostic Not Found</h1>
    )
  }

  return (
    <DiagnosticMain diagnostic={diagnostic} />
  );
}
