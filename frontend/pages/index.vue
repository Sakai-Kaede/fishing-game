<template>
  <div class="a">
    <AtomsButton variant="text_underline" size="small" disabled>
      Danger Outline
    </AtomsButton>
    <AtomsTextInput
      v-model="username"
      name="username"
      label="ユーザー名"
      placeholder="ユーザー名を入力"
      required
      :errorMessage="usernameError"
      :size="'large'"
    />
    <button @click="validate">フォームを送信</button>
  </div>
</template>

<script setup lang="ts">
const username = ref("");
const usernameError = ref(""); // 初期値は空

// バリデーション関数
function validate() {
  if (!username.value.trim()) {
    usernameError.value = "ユーザー名は必須です";
  } else {
    usernameError.value = ""; // エラーなし
  }
}
</script>

<style>
.a {
  background-color: red;
}
</style>
