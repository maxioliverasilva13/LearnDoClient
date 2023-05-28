import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const EventoService = createApi({
  reducerPath: "EventoService",
  baseQuery: baseQuery,
  tagTypes: [
    "Eventos",
    "EventoInfo",
    "ListEventos",
    "EventosPresenciales",
    "SelectedCursoInfo",
    "CursosComprados",
    "MisCursos",
    "ListSugerencias",
  ],
  endpoints: (builder) => ({
    listarEventos: builder.query({
      query: (data) => {
        const { page, rowsNumbers, filterData = null, busqueda = "" } = data;
        let query = `${apiRoutes.listarEventos()}?page=${page}&maxRows=${rowsNumbers}`;
        if (filterData) {
          if (filterData.categoriasIds && filterData.categoriasIds.length > 0) {
            var categoriasArrQry = filterData.categoriasIds
              .map(function (id, idx) {
                return "&categoria[" + idx + "]=" + id;
              })
              .join("&");
            query = `${query}${categoriasArrQry}`;
          }
        }
        if (busqueda && busqueda.trim().length > 0) {
          query = `${query}${busqueda}`;
        }
        // console.log(query);
        return query;
      },
      providesTags: ["ListEventos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createEvento: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createEvento()}`,
        method: "POST",
        body: {
          nombre: data?.nombre,
          descripcion: data?.descripcion,
          imagen: data?.imagen,
          es_pago: data?.es_pago,
          precio: data?.precio,
          organizador: data?.organizador,
          porcentaje_aprobacion: data?.porcentaje_aprobacion,
          categorias: data?.categorias,
          tipo: data?.tipo,
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["ListEventos"],
    }),
    crearSeminario: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.createEvento(),
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["ListEventos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createModulo: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createModulo()}`,
        method: "POST",
        body: {
          curso_id: data?.curso_id,
          sugerencia_id: data?.sugerencia_id,
          nombre: data?.nombre,
          clases: data?.clases,
          evaluacion: data?.evaluacion,
          estado: data?.estado,
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createColaboraciones: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createColaboraciones()}`,
        method: "POST",
        body: {
          evento_id: data?.evento_id,
          colaboradores: data?.colaboradores,
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    uploadVideo: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("id_clase", data?.id_clase);
        formData.append("video", data?.video);
        return {
          url: `${apiRoutes.uploadVideo()}`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getSeminariosPresenciales: builder.query({
      query: () => apiRoutes.listarEventosPresenciales(),
      providesTags: ["Categorias", "EventosPresenciales"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getCompleteCursoInfo: builder.query({
      query: ({ cursoId }) =>
        `${apiRoutes.getCompleteCursoInfo()}?cursoId=${cursoId}`,
      providesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        console.log(value);
        const response = value;
        return response;
      },
    }),
    puntuarCurso: builder.mutation({
      query: (data) => {
        return {
          url: `${apiRoutes.puntuarCurso()}`,
          method: "POST",
          body: {
            description: data?.description,
            rating: data?.rating,
            userId: data?.userId,
            cursoId: data?.cursoId,
          },
        };
      },
      invalidatesTags: ["MisCursos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["SelectedCursoInfo"],
    }),
    getEvaluacionInfo: builder.query({
      query: ({ evaluacionId }) => apiRoutes.evaluacionInfo(evaluacionId),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    correjirEvaluacion: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.correjirEvaluacion(),
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getCursosComprados: builder.query({
      query: (data) => apiRoutes.getCursosComprados(data?.estudianteId),
      provideTags: ["MisCursos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getCursoAndClases: builder.query({
      query: ({ cursoId }) => apiRoutes.getCursoAndClases(cursoId),
      provideTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createSugerencia: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.createSugerencia(),
          method: "POST",
          body: {
            contenido: data?.contenido,
            estado: data?.estado,
            curso_id: data?.curso_id,
            estudiante_id: data?.estudiante_id,
          },
        };
      },
      invalidatesTags: ["ListSugerencias"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    comprarevento: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.comprarEvento()}`,
        method: "POST",
        body: {
          uid: data?.userId,
          monto: data.monto,
          metodoPago: data.metodoPago,
          eventoId: data?.eventoId,
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const {
  useListarEventosQuery,
  useCreateEventoMutation,
  useCreateModuloMutation,
  useCreateColaboracionesMutation,
  useCrearSeminarioMutation,
  useUploadVideoMutation,
  useGetSeminariosPresencialesQuery,
  useGetCompleteCursoInfoQuery,
  usePuntuarCursoMutation,
  useGetEvaluacionInfoQuery,
  useCorrejirEvaluacionMutation,
  useGetCursosCompradosQuery,
  useGetCursoAndClasesQuery,
  useCreateSugerenciaMutation,
  useComprareventoMutation,
} = EventoService;
