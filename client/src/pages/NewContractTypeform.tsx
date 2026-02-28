import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONTRACT_CATEGORIES = [
  { value: "freelance", label: "Freelance Services", emoji: "💼", description: "Web design, writing, consulting" },
  { value: "home_improvement", label: "Home Improvement", emoji: "🏠", description: "Renovations, repairs, installations" },
  { value: "event_services", label: "Event Services", emoji: "🎉", description: "Photography, catering, entertainment" },
  { value: "trade_services", label: "Trade Services", emoji: "🔧", description: "Plumbing, electrical, carpentry" },
  { value: "other", label: "Other Services", emoji: "📋", description: "Custom service agreements" },
];

const QUESTIONS = [
  { id: "category", type: "choice", question: "What type of service contract do you need?", placeholder: "" },
  { id: "title", type: "text", question: "What's the name of this project?", placeholder: "e.g., Website Design for Small Business" },
  { id: "description", type: "textarea", question: "Describe the work to be done", placeholder: "Be specific about deliverables, timeline, and requirements..." },
  { id: "totalAmount", type: "number", question: "What's the total contract value?", placeholder: "0.00", prefix: "£" },
  { id: "providerEmail", type: "email", question: "Do you know the service provider's email? (Optional)", placeholder: "provider@example.com" },
  { id: "startDate", type: "date", question: "When should the work start? (Optional)", placeholder: "" },
  { id: "endDate", type: "date", question: "When should it be completed? (Optional)", placeholder: "" },
];

export default function NewContractTypeform() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  const createMutation = trpc.contracts.create.useMutation({
    onSuccess: (data) => {
      toast.success("Contract created successfully!");
      setLocation(`/dashboard/contracts/${data.contractId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create contract");
    },
  });

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    const value = formData[currentQuestion.id];
    
    // Validation
    if (currentQuestion.id === "category" && !value) {
      toast.error("Please select a category");
      return;
    }
    if (currentQuestion.id === "title" && !value) {
      toast.error("Please enter a project name");
      return;
    }
    if (currentQuestion.id === "description" && !value) {
      toast.error("Please describe the work");
      return;
    }
    if (currentQuestion.id === "totalAmount") {
      if (!value) {
        toast.error("Please enter the contract value");
        return;
      }
      const amount = parseFloat(value);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
    }

    if (currentStep < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Submit
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/dashboard/contracts");
    }
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.totalAmount);
    
    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      providerEmail: formData.providerEmail || undefined,
      totalAmount: amount,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      content: {
        terms: formData.description,
        createdBy: "client",
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentQuestion.type !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentStep + 1} of {QUESTIONS.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="space-y-8">
                {/* Question Number */}
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                    {currentStep + 1}
                  </div>
                  <span className="text-sm">Question {currentStep + 1}</span>
                </div>

                {/* Question */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {currentQuestion.question}
                </h1>

                {/* Input */}
                <div className="space-y-4">
                  {currentQuestion.type === "choice" && (
                    <div className="grid gap-3">
                      {CONTRACT_CATEGORIES.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => {
                            setFormData({ ...formData, category: category.value });
                            setTimeout(() => handleNext(), 300);
                          }}
                          className={`p-6 rounded-xl border-2 transition-all text-left hover:border-primary hover:shadow-md ${
                            formData.category === category.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{category.emoji}</span>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{category.label}</h3>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                            {formData.category === category.value && (
                              <Check className="h-6 w-6 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "text" && (
                    <Input
                      type="text"
                      placeholder={currentQuestion.placeholder}
                      value={formData[currentQuestion.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="text-2xl h-16 px-6 border-2 focus:border-primary"
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === "textarea" && (
                    <Textarea
                      placeholder={currentQuestion.placeholder}
                      value={formData[currentQuestion.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                      className="text-xl p-6 border-2 focus:border-primary min-h-[200px]"
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === "number" && (
                    <div className="relative">
                      {currentQuestion.prefix && (
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                          {currentQuestion.prefix}
                        </span>
                      )}
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={currentQuestion.placeholder}
                        value={formData[currentQuestion.id] || ""}
                        onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className={`text-2xl h-16 border-2 focus:border-primary ${
                          currentQuestion.prefix ? "pl-12 pr-6" : "px-6"
                        }`}
                        autoFocus
                      />
                    </div>
                  )}

                  {currentQuestion.type === "email" && (
                    <Input
                      type="email"
                      placeholder={currentQuestion.placeholder}
                      value={formData[currentQuestion.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="text-2xl h-16 px-6 border-2 focus:border-primary"
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === "date" && (
                    <Input
                      type="date"
                      value={formData[currentQuestion.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="text-xl h-16 px-6 border-2 focus:border-primary"
                      autoFocus
                    />
                  )}
                </div>

                {/* Actions */}
                {currentQuestion.type !== "choice" && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="text-lg h-14 px-8"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating...
                        </>
                      ) : currentStep === QUESTIONS.length - 1 ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Create Contract
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    {(currentQuestion.id === "providerEmail" || 
                      currentQuestion.id === "startDate" || 
                      currentQuestion.id === "endDate") && (
                      <Button
                        onClick={handleNext}
                        variant="ghost"
                        size="lg"
                        className="text-lg h-14"
                      >
                        Skip
                      </Button>
                    )}
                  </div>
                )}

                {/* Hint */}
                {currentQuestion.type !== "choice" && (
                  <p className="text-sm text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-gray-100 rounded border">Enter ↵</kbd> to continue
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

