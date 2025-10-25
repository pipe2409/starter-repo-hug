import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mascotImage from "@/assets/mascot-transparent.png";

const plans = [
  {
    name: "Gratuito",
    price: "0",
    description: "Perfecto para comenzar tu aventura financiera",
    features: [
      "Acceso a 5 lecciones básicas",
      "Misiones diarias limitadas",
      "Tabla de clasificación",
      "100 monedas de inicio",
    ],
    color: "from-muted to-muted/80",
    buttonVariant: "outline" as const,
  },
  {
    name: "Básico",
    price: "9.99",
    description: "Desbloquea más contenido y recompensas",
    features: [
      "Acceso a 20 lecciones",
      "Misiones diarias ilimitadas",
      "Recompensas exclusivas",
      "500 monedas de inicio",
      "Sin anuncios",
    ],
    color: "from-primary to-purple-600",
    buttonVariant: "secondary" as const,
    popular: true,
  },
  {
    name: "Premium",
    price: "19.99",
    description: "La experiencia completa de aprendizaje",
    features: [
      "Acceso ilimitado a todas las lecciones",
      "Misiones y desafíos exclusivos",
      "Recompensas premium",
      "1000 monedas de inicio",
      "Sin anuncios",
      "Soporte prioritario",
      "Insignias especiales",
    ],
    color: "from-secondary to-orange-400",
    buttonVariant: "default" as const,
  },
];

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: `¡Plan ${planName} seleccionado! 🎉`,
      description: "Redirigiendo a la página principal...",
    });

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src={mascotImage}
            alt="LuckCash"
            className="w-24 h-24 mx-auto mb-6 animate-bounce-in"
          />
          <h1 className="text-4xl md:text-5xl font-bold font-fredoka bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            ¡Elige tu plan de aprendizaje! 🚀
          </h1>
          <p className="text-lg text-muted-foreground font-poppins max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tu viaje de aprendizaje financiero
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular ? "shadow-2xl border-2 border-primary" : "shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-4 py-1 text-sm font-bold rounded-bl-lg">
                  MÁS POPULAR
                </div>
              )}

              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                >
                  <span className="text-3xl font-bold text-white">
                    {plan.name === "Gratuito" ? "🆓" : plan.name === "Básico" ? "⭐" : "👑"}
                  </span>
                </div>
                <CardTitle className="text-2xl font-fredoka">{plan.name}</CardTitle>
                <CardDescription className="font-poppins">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold font-fredoka">
                    ${plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-muted-foreground font-poppins">/mes</span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-poppins">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:opacity-90"
                      : ""
                  }`}
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={selectedPlan !== null}
                >
                  {selectedPlan === plan.name ? "Seleccionado ✓" : "Seleccionar Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Skip button */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Omitir por ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
