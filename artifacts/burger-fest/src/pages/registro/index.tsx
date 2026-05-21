import { Link } from "wouter";
import { ArrowLeft, Utensils, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Registro() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-foreground">
              <img
                src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                alt="Burger Fest Logo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold text-foreground">Burger Fest</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Volver al Inicio</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Únete a Burger Fest 2026
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Elige cómo quieres participar en el festival gastronómico más importante dedicado a la cultura de las hamburguesas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Soy un Restaurante</CardTitle>
              <CardDescription>
                Inscribe tu restaurante y participa con tu mejor hamburguesa en el festival
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Exposición a miles de visitantes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Participa en el concurso de hamburguesas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Promoción en redes y materiales
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/registro/restaurante">
                  Inscribir Restaurante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Briefcase className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="text-xl">Soy un Patrocinador</CardTitle>
              <CardDescription>
                Apoya el festival y obtén visibilidad para tu marca frente a nuestra audiencia
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Logo en materiales oficiales
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Menciones en redes sociales
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Diferentes niveles de patrocinio
                </li>
              </ul>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/registro/patrocinador">
                  Ser Patrocinador
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border bg-muted/30 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Burger Fest. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
