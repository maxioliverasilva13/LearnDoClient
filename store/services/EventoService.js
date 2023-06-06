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
    "SelectedSeminarioInfo",
    "CursosComprados",
    "MisCursos",
    "MisEventosAdmin",
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
          if(filterData.tipo){
            const tipoQuery = filterData.tipo == "Curso" ? "curso" : 
            filterData.tipo == "SeminarioOnline" ? "seminarioV" : 
            filterData.tipo == "SeminarioPresencial" ? "seminarioP" : ""; 

            query = `${query}&tipo=${tipoQuery}`;
          }
        }
        if (busqueda && busqueda.trim().length > 0) {
          query = `${query}&busqueda=${busqueda}`;
        }
        return query;
      },
      providesTags: ["ListEventos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),

    userIsStudentOrOwner: builder.query({
      query: ({eventoId}) => {
        return apiRoutes.userIsStudentOrOwner(eventoId);
      },

      providesTags: ["userIsStudentOrOwner"],
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["userIsStudentOrOwner"]
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
      invalidatesTags: ["ListEventos", "MisEventosAdmin"],
    }),
    updateCursoInfo: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.updateCursoInfo()}`,
        method: "PUT",
        body: data,
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["ListEventos", "SelectedCursoInfo"],
    }),
    updateStatusSugerencia: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.changeStatusSugerencia()}`,
        method: "PUT",
        body: {
          sugerencia_id: data?.sugerencia_id,
          estado: data?.status,
        },
      }),
      invalidatesTags: ["SelectedCursoInfo"],
    }),
    crearSeminario: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.createEvento(),
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["ListEventos", "MisEventosAdmin"],
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
      invalidatesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    deleteModulo: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.deletemodulo(data?.moduloId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    deletePregunta: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.deletePregunta(data?.preguntaId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SelectedCursoInfo"],
    }),
    deleteClase: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.deleteClase(data?.claseId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SelectedCursoInfo"],
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
    deleteColaboracion: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.deleteColaboracion()}`,
        method: "DELETE",
        body: {
          evento_id: data?.evento_id,
          user_id: data?.user_id,
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
      query: ({ cursoId, withDetails = false }) =>
        `${apiRoutes.getCompleteCursoInfo()}?cursoId=${cursoId}&withDetails=${withDetails}`,
      providesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
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
    getEventosComprados: builder.query({
      query: (data) => `${apiRoutes.getEventosComprados()}${data && `?uid=${data}`}`,
      provideTags: ["MisEventos"],
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
          monto: data?.monto,
          metodoPago: data?.metodoPago,
          eventoId: data?.eventoId,
          useDiscount: data?.useDiscount || false,
        },
      }),
      invalidatesTags: ["SelectedCursoInfo", "SelectedSeminarioInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getEventosAdmin: builder.query({
      query: (data) => apiRoutes.getEventosAdmin(data?.organizadorId),
      providesTags: ["MisEventosAdmin"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    isUserColaborador: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.isUserColaborador(),
          method: "POST",
          body: {
            user_id: data?.user_id,
            evento_id: data?.evento_id,
          },
        };
      },
    }),
    updateAllInfoOfModulo: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.updateAllOfModulo()}`,
        method: "PUT",
        body: {
          modulos: data,
        },
      }),
      invalidatesTags: ["SelectedCursoInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getCompleteSeminarioInfo: builder.query({
      query: ({ seminarioId }) =>
        `${apiRoutes.getCompleteInfoSeminario()}?seminarioId=${seminarioId}`,
      providesTags: ["SelectedSeminarioInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getProgresoEstudiantes: builder.query({
      query: (data) => `${apiRoutes.getProgresoEstudiantes()}?userId=${data?.userId}&cursoId=${data?.cursoId}`,
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getTendencias: builder.query({
      query: (data) => `${apiRoutes.listarTendencias()}`,
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    getEventoInfo: builder.query({
      query: (eventoId) => `${apiRoutes.getEventoInfo(eventoId)}`,
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
  useGetEventosCompradosQuery,
  useGetCursosCompradosQuery,
  useLazyGetCursosCompradosQuery,
  useGetCursoAndClasesQuery,
  useCreateSugerenciaMutation,
  useComprareventoMutation,
  useIsUserColaboradorMutation,
  useGetEventosAdminQuery,
  useUpdateCursoInfoMutation,
  useUpdateAllInfoOfModuloMutation,
  useDeleteColaboracionMutation,
  useDeleteModuloMutation,
  useDeleteClaseMutation,
  useDeletePreguntaMutation,
  useUpdateStatusSugerenciaMutation,
  useGetCompleteSeminarioInfoQuery,
  useGetProgresoEstudiantesQuery,
  useGetTendenciasQuery,
  useLazyGetEventosAdminQuery,
  useUserIsStudentOrOwnerQuery,
  useCanGetCertificateQuery,
  useLazyGetEventosCompradosQuery,
  useGetEventoInfoQuery,
} = EventoService;
