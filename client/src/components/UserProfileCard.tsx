import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Edit2, Check, X } from 'lucide-react';

export function UserProfileCard() {
  const { profile, updateProfile, calculateIMC, calculateIdealWeight } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(profile?.weight.toString() || '');
  const [height, setHeight] = useState(profile?.height.toString() || '');

  const handleSave = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (w > 0 && h > 0) {
      updateProfile(w, h);
      setIsEditing(false);
    }
  };

  const imc = profile ? calculateIMC(profile.weight, profile.height) : 0;
  const idealWeight = profile ? calculateIdealWeight(profile.height) : null;

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Meu Perfil</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-white"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-slate-300">
                Peso (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: 75.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-slate-300">
                Altura (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: 180"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Check className="w-4 h-4" />
              Salvar
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : profile ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Peso</p>
              <p className="text-lg font-semibold text-white">{profile.weight} kg</p>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Altura</p>
              <p className="text-lg font-semibold text-white">{profile.height} cm</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">IMC</p>
              <p className="text-lg font-semibold text-white">{imc}</p>
              <p className="text-xs text-slate-400 mt-1">
                {imc < 18.5
                  ? 'Abaixo do peso'
                  : imc < 25
                  ? 'Normal'
                  : imc < 30
                  ? 'Sobrepeso'
                  : 'Obeso'}
              </p>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Peso Ideal</p>
              <p className="text-lg font-semibold text-white">
                {idealWeight?.min}-{idealWeight?.max} kg
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Atualizado em {new Date(profile.dateUpdated).toLocaleDateString('pt-BR')}
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-400 mb-4">Adicione seus dados para começar</p>
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Adicionar Dados
          </Button>
        </div>
      )}
    </Card>
  );
}

