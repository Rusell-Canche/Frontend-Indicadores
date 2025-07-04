<template>
  <div class="asignar-permisos">
    <h1>Asignar Permisos</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="usuario">Usuario:</label>
        <select v-model="selectedUser" id="usuario" required>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="permisos">Permisos:</label>
        <div v-for="permiso in permisos" :key="permiso.id" class="checkbox-group">
          <input
            type="checkbox"
            :id="'permiso-' + permiso.id"
            :value="permiso.id"
            v-model="selectedPermissions"
          />
          <label :for="'permiso-' + permiso.id">{{ permiso.name }}</label>
        </div>
      </div>

      <button type="submit">Asignar Permisos</button>
    </form>
  </div>
</template>
<script></script>
