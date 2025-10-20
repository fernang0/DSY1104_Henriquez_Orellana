/**
 * Datos para la sección "Contacto" de LevelUp Gaming
 * Información extraída de la rama Orellana
 */

// Información principal de contacto
export const contactInfo = {
  title: "📍 Información de Contacto",
  description: "¿Tienes dudas? Estamos aquí para ayudarte",
  subtitle: "Conecta con nosotros y lleva tu gaming al siguiente nivel"
};

// Datos de contacto de la empresa
export const companyContact = {
  address: {
    icon: "🏢",
    title: "Dirección",
    value: "Av. Gaming 123, Santiago, Chile",
    details: "Edificio TechHub, Piso 5, Oficina 502",
    mapUrl: "https://maps.google.com/?q=Av.+Gaming+123,+Santiago,+Chile"
  },
  phone: {
    icon: "📞",
    title: "Teléfono",
    value: "+56 2 2345 6789",
    whatsapp: "+56 9 8765 4321",
    international: "+56 2 2345 6789"
  },
  email: {
    icon: "📧",
    title: "Email",
    primary: "contacto@levelup.cl",
    support: "soporte@levelup.cl",
    sales: "ventas@levelup.cl",
    general: "info@levelup.cl"
  },
  schedule: {
    icon: "🕒",
    title: "Horarios de Atención",
    weekdays: {
      days: "Lunes a Viernes",
      hours: "9:00 - 18:00",
      description: "Atención completa y soporte técnico"
    },
    saturday: {
      days: "Sábados",
      hours: "10:00 - 14:00", 
      description: "Atención comercial y ventas"
    },
    sunday: {
      days: "Domingos",
      hours: "Cerrado",
      description: "Soporte online disponible 24/7"
    }
  }
};

// Redes sociales
export const socialNetworks = [
  {
    id: 1,
    name: "Facebook",
    icon: "📘",
    url: "https://facebook.com/levelup",
    username: "@LevelUpGamingCL",
    description: "Noticias y actualizaciones diarias",
    color: "#1877f2",
    followers: "15.2K"
  },
  {
    id: 2,
    name: "Instagram",
    icon: "📸",
    url: "https://instagram.com/levelup",
    username: "@levelupgaming.cl",
    description: "Fotos de productos y setup gaming",
    color: "#E4405F",
    followers: "8.7K"
  },
  {
    id: 3,
    name: "Twitter/X",
    icon: "🐦",
    url: "https://twitter.com/levelup",
    username: "@LevelUpGamingCL",
    description: "Noticias y soporte en tiempo real",
    color: "#1DA1F2",
    followers: "12.3K"
  },
  {
    id: 4,
    name: "Discord",
    icon: "💬",
    url: "https://discord.gg/levelup",
    username: "LevelUp Gaming Chile",
    description: "Comunidad gaming y soporte técnico",
    color: "#5865F2",
    members: "3.2K"
  },
  {
    id: 5,
    name: "YouTube",
    icon: "📺",
    url: "https://youtube.com/levelupgaming",
    username: "@LevelUpGamingChile",
    description: "Reviews, unboxings y tutoriales",
    color: "#FF0000",
    subscribers: "25.8K"
  },
  {
    id: 6,
    name: "TikTok",
    icon: "🎵",
    url: "https://tiktok.com/@levelupgaming",
    username: "@levelupgaming.cl",
    description: "Gaming tips y contenido viral",
    color: "#000000",
    followers: "45.6K"
  }
];

// Opciones del formulario de contacto
export const contactFormOptions = {
  subjects: [
    {
      value: "",
      label: "Selecciona un tema",
      disabled: true
    },
    {
      value: "soporte",
      label: "Soporte Técnico",
      icon: "🔧",
      description: "Problemas técnicos, instalación, configuración"
    },
    {
      value: "ventas",
      label: "Consultas de Ventas",
      icon: "💰",
      description: "Información de productos, precios, disponibilidad"
    },
    {
      value: "garantia",
      label: "Garantía",
      icon: "🛡️",
      description: "Reclamos, devoluciones, garantías"
    },
    {
      value: "partnerships",
      label: "Partnerships",
      icon: "🤝",
      description: "Colaboraciones comerciales y alianzas"
    },
    {
      value: "eventos",
      label: "Eventos Gaming",
      icon: "🎮",
      description: "Torneos, eventos y actividades gaming"
    },
    {
      value: "otro",
      label: "Otro",
      icon: "💬",
      description: "Cualquier otra consulta"
    }
  ]
};

// Configuración del formulario
export const formConfig = {
  validation: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    subject: {
      required: true
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  },
  messages: {
    success: "¡Mensaje enviado exitosamente! Te contactaremos pronto.",
    error: "Error al enviar el mensaje. Inténtalo nuevamente.",
    validation: {
      nameRequired: "El nombre es requerido",
      namePattern: "Solo se permiten letras y espacios",
      emailRequired: "El email es requerido", 
      emailPattern: "Ingresa un email válido",
      subjectRequired: "Selecciona un tema",
      messageRequired: "El mensaje es requerido",
      messageMinLength: "El mensaje debe tener al menos 10 caracteres"
    }
  }
};

// Información adicional de contacto
export const additionalInfo = [
  {
    id: 1,
    title: "🚚 Envíos",
    description: "Envíos gratis en compras sobre $50.000",
    details: "Despacho en 24-48 horas a todo Chile continental"
  },
  {
    id: 2,
    title: "💳 Métodos de Pago",
    description: "Tarjetas de crédito, débito, transferencia",
    details: "WebPay, Mercado Pago, transferencia bancaria"
  },
  {
    id: 3,
    title: "🛡️ Garantía",
    description: "Garantía extendida en todos los productos",
    details: "Hasta 2 años de garantía según producto"
  },
  {
    id: 4,
    title: "🎧 Soporte 24/7",
    description: "Soporte técnico especializado",
    details: "Chat en vivo, email y teléfono"
  }
];

// FAQ relacionadas con contacto
export const contactFAQ = [
  {
    id: 1,
    question: "¿Cuál es el tiempo de respuesta promedio?",
    answer: "Respondemos consultas por email en máximo 24 horas y por redes sociales en 2-4 horas durante horario comercial."
  },
  {
    id: 2,
    question: "¿Ofrecen soporte técnico para instalación?",
    answer: "Sí, ofrecemos soporte técnico completo para instalación de hardware y software gaming, tanto remoto como presencial."
  },
  {
    id: 3,
    question: "¿Puedo visitar su tienda física?",
    answer: "Por ahora somos 100% online, pero planeamos abrir showroom en Santiago durante 2025. ¡Síguenos para estar al día!"
  },
  {
    id: 4,
    question: "¿Hacen envíos a regiones?",
    answer: "Sí, realizamos envíos a todas las regiones de Chile. Los costos y tiempos varían según la ubicación."
  },
  {
    id: 5,
    question: "¿Cómo puedo hacer seguimiento de mi pedido?",
    answer: "Te enviamos un código de seguimiento por email una vez despachado tu pedido. También puedes consultar el estado en tu cuenta."
  }
];

// Configuración de la página Contact
export const contactConfig = {
  pageTitle: "Contacto - LevelUp Gaming",
  pageDescription: "Contacta con LevelUp Gaming. Soporte técnico, ventas y consultas. ¡Estamos aquí para ayudarte!",
  sections: {
    hero: true,
    contactInfo: true,
    contactForm: true,
    socialNetworks: true,
    additionalInfo: true,
    faq: false // FAQ opcional
  },
  animations: {
    enabled: true,
    duration: 0.6,
    stagger: 0.2
  },
  features: {
    realTimeValidation: true,
    successAnimation: true,
    socialMediaIntegration: true,
    mapIntegration: false // Opcional para el futuro
  }
};