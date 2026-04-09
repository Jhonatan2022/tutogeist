// src/hooks/useInstructores.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const useInstructores = (session) => {
  const [instructores, setInstructores]         = useState([]);
  const [fichasAceptadas, setFichasAceptadas]   = useState([]); // { ficha_id, ficha }
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetchData();
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Todos los instructores con sus fichas
      const { data: todosInstructores, error: instErr } = await supabase
        .from('vista_instructores')
        .select('*');
      if (instErr) throw instErr;

      // 2. Fichas donde el estudiante ya tiene solicitud (cualquier estado)
      const { data: solicitudes, error: solErr } = await supabase
        .from('solicitudes')
        .select('ficha_id, estado, fichas:ficha_id(id, codigo, nombre)')
        .eq('estudiante_id', session.user.id);
      if (solErr) throw solErr;

      // Map de ficha_id → estado para lookup rápido
      const solicitudPorFicha = {};
      (solicitudes || []).forEach(s => {
        solicitudPorFicha[s.ficha_id] = s.estado;
      });

      const aceptadas = (solicitudes || [])
        .filter(s => s.estado === 'accepted')
        .map(s => s.fichas)
        .filter(Boolean);

      setFichasAceptadas(aceptadas);

      // Enriquecer instructores: marcar fichas ya solicitadas y si tiene aceptación
      const enriquecidos = (todosInstructores || []).map(inst => {
        const fichas = (inst.fichas_ids || []).map((fid, i) => ({
          id:     fid,
          codigo: inst.fichas_codigos?.[i],
          nombre: inst.fichas_nombres?.[i],
          estado: solicitudPorFicha[fid] || null, // null = nunca solicitada
        }));

        const tieneAceptacion = fichas.some(f => f.estado === 'accepted');
        const fichasDisponibles = fichas.filter(f => !f.estado); // sin solicitud aún

        return { ...inst, fichas, tieneAceptacion, fichasDisponibles };
      });

      setInstructores(enriquecidos);
    } catch (err) {
      console.error('Error cargando instructores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { instructores, fichasAceptadas, loading, error, refetch: fetchData };
};