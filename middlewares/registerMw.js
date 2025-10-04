export function registerMw(request, response, next){
  const { nome, cognome, email, password, dataDiNascita } = request.body;
  if(!nome || !cognome || !email || !password || !dataDiNascita)
    return response.status(400).json({message: 'Inserire tutti i campi obbligatori (*)'});
  next(); 
}