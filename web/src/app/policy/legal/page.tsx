// app/legal/page.tsx
export default function LegalPage() {
	return (
	  <div className="min-h-screen flex flex-col items-center justify-start px-6 py-16 bg-gray-50 text-gray-900">
		<h1 className="text-3xl font-bold mb-6">Legal Notice</h1>
  
		<div className="max-w-3xl space-y-4 text-sm text-gray-700">
		  <p>
			This website is operated by <strong>TriggerHub</strong>. By using this website, you agree to comply with and be bound by the following legal terms.
		  </p>
  
		  <h2 className="text-xl font-semibold mt-4">Publisher Information</h2>
		  <p>
			Company: TriggerHub<br />
			Address: 123 Startup Lane, Innovation City<br />
			Email: <a href="mailto:contact@triggerhub.com" className="text-blue-500 hover:underline">contact@triggerhub.com</a><br />
			Phone: +1 234 567 890
		  </p>
  
		  <h2 className="text-xl font-semibold mt-4">Purpose of the Website</h2>
		  <p>
		  The purpose of this website is to showcase projects developed within <strong>TriggerHub</strong>, highlight startups supported by the incubator, and facilitate connections with investors, partners, and clients.
		  <br></br><br></br>
		  By accessing this website, you acknowledge that you have read, understood, and agreed to be bound by these legal terms.
		  </p>

		  <h2 className="text-xl font-semibold mt-4">Intelectual Property</h2>
		  <p>
		  All content available on this website, including but not limited to text, graphics, logos, icons, images, and their arrangement, is the exclusive property of TriggerHub or its content providers, and is protected by applicable intellectual property and copyright laws.
		  <br></br><br></br>
		  Any reproduction, distribution, modification, or use of the materials, in whole or in part, without prior written authorization from <strong>TriggerHub</strong>, is strictly prohibited.
		  </p>

		  <h2 className="text-xl font-semibold mt-4">External Links</h2>
		  <p>
			This website may contain links to third-party websites. <strong>TriggerHub</strong> has no control over these external resources and cannot be held responsible for their availability, content, or any damages that may result from their use.
		  </p>

		  <h2 className="text-xl font-semibold mt-4">Liability</h2>
		  <p>
						
			While TriggerHub makes every effort to ensure that the information provided on this website is accurate and up-to-date, no guarantee is made regarding its completeness, accuracy, or reliability.
			<br></br><br></br>
			Use of the website and its content is at your own risk. TriggerHub shall not be held liable for any direct, indirect, incidental, or consequential damages arising from access to or use of this site.
		  </p>
  
		  <h2 className="text-xl font-semibold mt-4"></h2>
		  <p>
			<strong>TriggerHub</strong> makes every effort to provide accurate information but does not guarantee completeness or correctness. The use of this website is at your own risk.
		  </p>
  
		  <h2 className="text-xl font-semibold mt-4">Privacy and Data Protection</h2>
		  <p>
			For detailed information about how we collect, use, and protect your personal data, please refer to our <a href="/../policy/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
		  </p>
		</div>
	  </div>
	);
  }
  