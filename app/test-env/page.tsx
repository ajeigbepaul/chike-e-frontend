"use client";

export default function TestEnv() {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Frontend Environment Variables:</h2>
        <p><strong>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:</strong></p>
        <p className="text-sm bg-white p-2 rounded border">
          {publicKey || 'NOT SET'}
        </p>
        
        <p className="mt-4"><strong>Key Status:</strong> {publicKey ? '✅ Set' : '❌ Missing'}</p>
        
        {publicKey && (
          <p className="mt-2 text-sm text-gray-600">
            Key starts with: {publicKey.substring(0, 10)}...
          </p>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>If key is missing, check your <code>.env</code> file in the frontend folder</li>
          <li>Make sure the key starts with <code>pk_test_</code></li>
          <li>Restart your frontend server after adding the key</li>
          <li>Refresh this page to see updated values</li>
        </ol>
      </div>
    </div>
  );
}
