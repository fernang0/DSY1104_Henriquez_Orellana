// authData.js - Datos y configuración del sistema de autenticación
// Basado en la estructura encontrada en la rama Orellana

export const authConfig = {
  // Configuración general
  enableRememberMe: true,
  sessionTimeout: 3600000, // 1 hora en milliseconds
  maxLoginAttempts: 5,
  
  // Validaciones
  validation: {
    email: {
      allowedDomains: ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'],
      maxLength: 100
    },
    password: {
      minLength: 4,
      maxLength: 10
    },
    name: {
      minLength: 2,
      maxLength: 50
    },
    phone: {
      minLength: 8,
      maxLength: 15,
      optional: true
    },
    age: {
      minAge: 18
    },
    referralCode: {
      minLength: 6,
      maxLength: 10,
      pattern: /^[a-zA-Z0-9]{6,10}$/,
      bonus: 100 // puntos bonus
    }
  },
  
  // Beneficios de registro
  benefits: [
    {
      icon: "🎮",
      title: "Puntos LevelUp",
      description: "Gana puntos en cada compra"
    },
    {
      icon: "💎",
      title: "Ofertas Exclusivas",
      description: "Acceso a descuentos especiales"
    },
    {
      icon: "🏆",
      title: "Sistema de Niveles",
      description: "Desbloquea recompensas al subir de nivel"
    },
    {
      icon: "📧",
      title: "Descuento Estudiantes",
      description: "20% de descuento para estudiantes Duoc"
    }
  ]
};

// Cuentas demo para pruebas
export const demoAccounts = [
  {
    id: 'demo_admin',
    email: 'admin@duoc.cl',
    password: 'admin123',
    name: 'Admin Demo',
    role: 'Administrador',
    avatar: '👑',
    permissions: ['admin', 'user', 'moderator'],
    level: 10,
    points: 5000,
    isStudent: true,
    discount: 20
  },
  {
    id: 'demo_student',
    email: 'estudiante@duoc.cl',
    password: 'pass123',
    name: 'Estudiante Demo',
    role: 'Estudiante',
    avatar: '🎓',
    permissions: ['user'],
    level: 3,
    points: 850,
    isStudent: true,
    discount: 20
  },
  {
    id: 'demo_gamer',
    email: 'gamer@gmail.com',
    password: 'game456',
    name: 'Gamer Pro',
    role: 'Usuario',
    avatar: '🎮',
    permissions: ['user'],
    level: 7,
    points: 2340,
    isStudent: false,
    discount: 0
  }
];

// Códigos de referido válidos (simulación)
export const validReferralCodes = [
  'DUOC2025',
  'GAMER123',
  'LEVELUP1',
  'PROMO100',
  'STUDENT',
  'WELCOME',
  'NEWBIE25',
  'FRIEND50'
];

// Validaciones específicas
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresa un email válido',
    checkDomain: (email) => {
      const domain = email.split('@')[1];
      return authConfig.validation.email.allowedDomains.includes(domain);
    }
  },
  
  password: {
    minLength: authConfig.validation.password.minLength,
    maxLength: authConfig.validation.password.maxLength,
    message: `La contraseña debe tener entre ${authConfig.validation.password.minLength} y ${authConfig.validation.password.maxLength} caracteres`
  },
  
  name: {
    minLength: authConfig.validation.name.minLength,
    maxLength: authConfig.validation.name.maxLength,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  
  phone: {
    pattern: /^[0-9+\-\s()]+$/,
    message: 'Formato de teléfono inválido'
  },
  
  birthDate: {
    checkAge: (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        actualAge--;
      }
      
      return actualAge >= authConfig.validation.age.minAge;
    }
  },
  
  referralCode: {
    validate: (code) => {
      return validReferralCodes.includes(code.toUpperCase());
    }
  }
};

// Campos del formulario de registro
export const registerFormFields = [
  {
    name: 'firstName',
    label: 'Nombre',
    type: 'text',
    required: true,
    maxLength: 50,
    validation: 'name'
  },
  {
    name: 'lastName',
    label: 'Apellido',
    type: 'text',
    required: true,
    maxLength: 50,
    validation: 'name'
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    type: 'email',
    required: true,
    maxLength: 100,
    validation: 'email',
    help: 'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com'
  },
  {
    name: 'birthDate',
    label: 'Fecha de nacimiento',
    type: 'date',
    required: true,
    validation: 'birthDate',
    help: 'Debes ser mayor de 18 años'
  },
  {
    name: 'phone',
    label: 'Teléfono',
    type: 'tel',
    required: false,
    minLength: 8,
    maxLength: 15,
    validation: 'phone',
    help: 'Opcional (8-15 caracteres)'
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    required: true,
    minLength: 4,
    maxLength: 10,
    validation: 'password',
    help: 'Entre 4 y 10 caracteres'
  },
  {
    name: 'referralCode',
    label: 'Código de referido',
    type: 'text',
    required: false,
    maxLength: 10,
    validation: 'referralCode',
    help: 'Opcional - Alfanumérico de 6-10 caracteres (+100 puntos)'
  }
];

// Sistema de mensajes
export const authMessages = {
  login: {
    success: '¡Inicio de sesión exitoso! Redirigiendo...',
    invalidCredentials: 'Email o contraseña incorrectos',
    emailNotFound: 'No existe una cuenta con este email',
    accountLocked: 'Cuenta bloqueada por demasiados intentos fallidos',
    fieldRequired: 'Este campo es obligatorio'
  },
  
  register: {
    success: '¡Registro exitoso! Redirigiendo al inicio de sesión...',
    emailExists: 'Ya existe una cuenta con este email',
    invalidEmail: 'Email no válido o dominio no permitido',
    invalidAge: 'Debes ser mayor de 18 años',
    termsRequired: 'Debes aceptar los términos y condiciones',
    passwordWeak: 'La contraseña no cumple los requisitos mínimos'
  },
  
  validation: {
    emailInvalid: 'Formato de email inválido',
    emailDomainNotAllowed: 'Solo se permiten emails de duoc.cl, profesor.duoc.cl o gmail.com',
    passwordTooShort: 'La contraseña es demasiado corta',
    passwordTooLong: 'La contraseña es demasiado larga',
    nameInvalid: 'El nombre solo puede contener letras',
    phoneInvalid: 'Formato de teléfono inválido',
    ageInvalid: 'Debes ser mayor de 18 años',
    referralInvalid: 'Código de referido inválido'
  }
};