export interface Translations {
  appName: string;
  logout: string;
  loading: string;
  login: {
    title: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    register: string;
  };
  register: {
    title: string;
    name: string;
    email: string;
    password: string;
    submit: string;
    hasAccount: string;
    login: string;
  };
  boards: {
    title: string;
    empty: string;
    newBoard: string;
    create: string;
    loadError: string;
    createError: string;
  };
  boardDetail: {
    back: string;
    newTask: string;
    add: string;
    loadError: string;
    addError: string;
    updateError: string;
    columns: {
      todo: string;
      inProgress: string;
      done: string;
    };
  };
}

export const translations: Record<"en" | "es", Translations> = {
  en: {
    appName: "Task Flow",
    logout: "Log out",
    loading: "Loading...",

    login: {
      title: "Log in",
      email: "Email",
      password: "Password",
      submit: "Log in",
      noAccount: "No account?",
      register: "Register",
    },
    register: {
      title: "Create your account",
      name: "Name",
      email: "Email",
      password: "Password",
      submit: "Create account",
      hasAccount: "Already have an account?",
      login: "Log in",
    },
    boards: {
      title: "Your boards",
      empty: "No boards yet — create your first one below.",
      newBoard: "New board",
      create: "Create",
      loadError: "Could not load boards.",
      createError: "Could not create board.",
    },
    boardDetail: {
      back: "← Back to boards",
      newTask: "New task",
      add: "Add",
      loadError: "Could not load tasks.",
      addError: "Could not add task.",
      updateError: "Could not update task.",
      columns: {
        todo: "To do",
        inProgress: "In progress",
        done: "Done",
      },
    },
  },
  es: {
    appName: "Task Flow",
    logout: "Cerrar sesión",
    loading: "Cargando...",

    login: {
      title: "Iniciar sesión",
      email: "Email",
      password: "Contraseña",
      submit: "Iniciar sesión",
      noAccount: "¿No tenés cuenta?",
      register: "Registrarse",
    },
    register: {
      title: "Creá tu cuenta",
      name: "Nombre",
      email: "Email",
      password: "Contraseña",
      submit: "Crear cuenta",
      hasAccount: "¿Ya tenés una cuenta?",
      login: "Iniciar sesión",
    },
    boards: {
      title: "Tus tableros",
      empty: "Todavía no hay tableros — creá el primero abajo.",
      newBoard: "Nuevo tablero",
      create: "Crear",
      loadError: "No se pudieron cargar los tableros.",
      createError: "No se pudo crear el tablero.",
    },
    boardDetail: {
      back: "← Volver a los tableros",
      newTask: "Nueva tarea",
      add: "Agregar",
      loadError: "No se pudieron cargar las tareas.",
      addError: "No se pudo agregar la tarea.",
      updateError: "No se pudo actualizar la tarea.",
      columns: {
        todo: "Por hacer",
        inProgress: "En progreso",
        done: "Hecho",
      },
    },
  },
};

export type Language = keyof typeof translations;
