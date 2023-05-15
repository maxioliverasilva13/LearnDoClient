import UserProgress from "components/UserProgress/UserProgress";
import Image from "next/image";

const progressUsers = [
  {
    userName: "Mario Gonazales",
    userImage:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 95,
  },
  {
    userName: "Juan Pedro",
    userImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 68,
  },
  {
    userName: "Pepito Gomez",
    userImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 66,
  },
  {
    userName: "Maximiliano Gimenez",
    userImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 50,
  },
  {
    userName: "Rita Vazquez",
    userImage:
      "https://images.unsplash.com/photo-1484863137850-59afcfe05386?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
    porcentage: 30,
  },
  {
    userName: "Pepito Gomez",
    userImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 66,
  },
  {
    userName: "Maximiliano Gimenez",
    userImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 50,
  },
  {
    userName: "Rita Vazquez",
    userImage:
      "https://images.unsplash.com/photo-1484863137850-59afcfe05386?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
    porcentage: 30,
  },
  {
    userName: "Pepito Gomez",
    userImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 66,
  },
  {
    userName: "Maximiliano Gimenez",
    userImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 50,
  },
  {
    userName: "Rita Vazquez",
    userImage:
      "https://images.unsplash.com/photo-1484863137850-59afcfe05386?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
    porcentage: 30,
  },
  {
    userName: "Pepito Gomez",
    userImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 66,
  },
  {
    userName: "Maximiliano Gimenez",
    userImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60",
    porcentage: 50,
  },
  {
    userName: "Rita Vazquez",
    userImage:
      "https://images.unsplash.com/photo-1484863137850-59afcfe05386?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
    porcentage: 30,
  },
];

const ProgresoEstudiantes = () => {
  const aprobacion = 85;
  const cursoImage =
    "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/YHAKDOR3PZBRHCU2BIOX7XPJBA.jpg";
  const cursoName = "Curso Nombre 1";

  return (
    <div className="w-full h-full">
      <div className="w-full h-[250px] relative">
        <Image
          src={cursoImage}
          loader={() => cursoImage}
          layout="fill"
          objectFit="cover"
          className="bg-fixed"
        />
        <div className="w-full h-full flex items-end justify-start p-4 absolute top-0 left-0 bg-black bg-opacity-50">
            <p className="text-white font-semibold text-[40px]">{cursoName}</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start md:pt-[20px] pb-5 md:px-[80px]">
        <h1 className="text-white font-semibold pb-10 text-[30px]">
          Progreso Estudiantes
        </h1>

        <div className="w-full h-auto flex flex-col items-start justify-start gap-6 border-white border rounded-[10px] p-[32px] bg-transparent flex-grow max-h-full overflow-auto">
          <div className="w-full flex h-auto items-center justify-between">
            <p className="text-white font-semibold text-[18px]">Estudiante</p>
            <p className="text-white font-semibold text-[18px] pr-10">
              Progreso
            </p>
          </div>
          {progressUsers?.map((item, index) => {
            return (
              <UserProgress
                aprobacion={aprobacion}
                {...item}
                key={`UserProgress-${index}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgresoEstudiantes;
