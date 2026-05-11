import { useState, useEffect } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const LockedAccountState = ({ unlockAt }: { unlockAt: number }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calcTime = () => {
            const now = Date.now();
            if (unlockAt > now) {
                setTimeLeft(Math.floor((unlockAt - now) / 1000));
            } else {
                setTimeLeft(0);
                // In a real app we might trigger a re-mount or reload to switch back to login
                window.location.reload(); 
            }
        };

        calcTime();
        const interval = setInterval(calcTime, 1000);
        return () => clearInterval(interval);
    }, [unlockAt]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <Card className="glass-panel border-destructive/30">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl text-destructive flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Compte Temporairement Verrouillé</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <p className="text-sm text-muted-foreground">
                    Par mesure de sécurité suite à de multiples tentatives échouées, ce compte a été protégé.
                </p>
                <div className="bg-background rounded-lg border border-border p-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Temps restant avant déverrouillage</p>
                    <div className="text-4xl font-mono tracking-widest text-primary flex justify-center items-baseline space-x-2">
                        <span>{minutes.toString().padStart(2, '0')}</span>
                        <span className="text-2xl text-muted-foreground">:</span>
                        <span>{seconds.toString().padStart(2, '0')}</span>
                    </div>
                </div>
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-4">Si vous n'êtes pas à l'origine de ces tentatives, veuillez réinitialiser votre clés cryptographique.</p>
                    <Button variant="outline" className="w-full">
                        Protocol de Récupération
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
