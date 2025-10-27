import ChatForm from './components/ChatForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-normal mb-4 lowercase">
            not a form. a quick reality check.
          </h1>
          <p className="text-muted text-sm lowercase">
            if it's a fit, you'll book right here.
          </p>
        </div>

        {/* Chat Form */}
        <ChatForm />

        {/* Footer */}
        <div className="text-center mt-24 text-xs text-muted lowercase">
          you're not "applying". we're just making sure we don't waste your time.
        </div>
      </div>
    </main>
  );
}

