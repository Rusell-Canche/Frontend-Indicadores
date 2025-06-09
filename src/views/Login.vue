<template>
  <div class="container">
    <!-- Logo -->
    <div class="logo">
      <img src="../assets/logo.png" alt="Your Logo" width="800" height="400" />
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="login-form">
      <!-- Email Input -->
      <div>
        <label for="email" class="label">Correo Electrónico</label>
        <input
          id="email"
          v-model="email"
          class="input"
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          required
        />
      </div>

      <!-- Password Input -->
      <div style="margin-top: 1rem">
        <label for="password" class="label">Contraseña</label>
        <input
          id="password"
          v-model="password"
          class="input"
          type="password"
          name="password"
          placeholder="Contraseña"
          required
        />
      </div>

      <!-- Login Button -->
      <div class="button-container">
        <button type="submit" class="button">
          <RouterLink to="/PanelDeControl"> Iniciar sesión </RouterLink>
        </button>
      </div>
    </form>
  </div>
</template>

<script></script>

<style scoped>
/* Contenedor principal */
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1.5rem;
}

@media (min-width: 640px) {
  .container {
    padding-top: 0;
  }
}

/* Logo */
.logo {
  margin-bottom: 2rem;
}

/* Formulario de inicio de sesión */
.login-form {
  padding: 2rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  width: 100%;
}

@media (min-width: 640px) {
  .login-form {
    max-width: 28rem;
  }
}

/* Etiquetas */
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.label.dark {
  color: #d1d5db;
}

/* Campos de entrada */
.input {
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  width: 100%;
}

.input:focus {
  border-color: #6366f1;
  outline: none;
}

/* Botón de inicio de sesión */
.button {
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #7f1d1d;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #991b1b;
}

.button:focus {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.6),
    0 0 0 4px rgba(153, 27, 27, 0.5);
}

/* Contenedor del botón */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
