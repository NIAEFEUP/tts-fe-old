<template>
  <div class="schedule">
    <div class="times">
      <div v-for="time in times" v-text="time"/>
    </div><!--
 --><div class="schedule-days">
      <Column class="schedule-column" :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
        <template v-if="i === 1">
          <Class :height="`${4 * 21}px`" :top="`${2 * 21}px`" time="08:00 - 10:00"></Class>
        </template>
        <template v-else-if="i === 2">
          <Class :height="`${4 * 21}px`" :top="`${4 * 21}px`" time="09:00 - 11:00"></Class>
        </template>
      </Column>
    </div>
  </div>
</template>

<script>
  import Column from './Column';
  import Class from './Class';

  export default {
    components: {
      Column,
      Class,
    },
    name: 'Schedule',
    data() {
      return {
        start: 8,
        end: 24,
        days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      };
    },
    computed: {
      slotsPerColumn() {
        return 2 * (this.end - this.start);
      },
      times() {
        return Array(this.end - this.start + 1).fill(0)
          .map((_, i) => this.start + i)
          .map(x => (x < 10 ? `0${x}:00` : `${x}:00`));
      },
    },
  };
</script>

<style scoped>
  .times {
    vertical-align: top;
    width: 50px;
    display: inline-block;
    text-align: right;
    margin-top: 32px;
  }
  .times > div {
    font-weight: bold;
    height: 42px;
    margin-right: 10px;
    position: relative;
  }
  .schedule {
    text-align: left;
    margin: 10px auto;
    max-width: 900px;
    padding: 0 20px;
  }
  .schedule-days {
    display: inline-block;
    width: calc(100% - 50px);
  }
  .schedule-column {
    display: inline-block;
    position: relative;
    width: 16.6%;
    box-sizing: border-box;
  }
</style>
