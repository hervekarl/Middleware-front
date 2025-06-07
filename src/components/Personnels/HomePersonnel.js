import react from "react";
import GetPersonnels from "./GetPersonnels";
 const HomePersonnel = () => {
     return (
         <div className="p-4">
            <GetPersonnels />
             <div className="text-center mt-10">
                 <h1 className="text-2xl font-bold">Bienvenue sur la page d'accueil du personnel</h1>
                 <p className="mt-4 text-gray-600">Ici, vous pouvez consulter les informations de vos personnels.</p>
             </div>
         </div>
     );
 }
export default HomePersonnel;